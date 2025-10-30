import {User}  from "../models/user.model.js";
import jwt from "jsonwebtoken"

// Register User
export const Register = async (req,res) => {
    try {
           const { username, email, password } = req.body;
           if (!username || !email || !password) {
               return res.status(401).json({
                   message: "Something is missing, please check!",
                   success: false,
               });
           }
           const user = await User.findOne({ email });
           if (user) {
               return res.status(401).json({
                   message: "Try different email",
                   success: false,
               });
           };
           
           await User.create({
               username,
               email,
               password,
           });
           return res.status(201).json({
               message: "Account created successfully.",
               success: true,
           });
       } catch (error) {
           console.error(error);
           return res.status(500).json({
            message: "An internal server error occurred.",
            success: false
        });
       }
   }
// Login User
   export const Login = async (req,res) => {
        try {
            const {email,password} = req.body;
            if (!email || !password) {
               return res.status(400).json({
                   message: "Something is missing, please check!",
                   success: false,
               });
           }
           const user = await User.findOne({email})
           if(!user){
            return res.status(401).json({
                message:"incorrect email or password",
                success:false,
            })
           }
           const ishasedPassword = await user.comparePassword(password);
           if(!ishasedPassword){
             return res.status(401).json({
                message:"incorrect email or password",
                success:false,
            })
           }
           const accesstoken = jwt.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn:"15m"})

            const safeUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
        }
        return res.cookie('token',accesstoken,{ httpOnly: true,secure: false, sameSite: 'lax', maxAge: 15 * 60 * 1000 })
        .json({
            message:"Login successful",
            success:true,
            user:safeUser,accesstoken,
        })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
            message: "An internal server error occurred.",
            success: false
        });
        }
   }

// Logout User
export const Logout = async (req,res) => {
    try {
        return res.cookie("token", "", {
        httpOnly: true,          
        sameSite: "strict",   
        expires: new Date(0), 
      })
      .status(200)
      .json({
        message: "Logged out successfully",
        success: true,
      });
    } catch (error) {
       console.error(error);
       return res.status(500).json({
            message: "An internal server error occurred.",
            success: false
        }); 
    }
}
// Get User Profile
export const getUserProfile = async (req,res) => {
    try {
        const user = await User.findById(req.user?._id).select("-password");
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false,
            })
        }
        return res.status(200).json({
            message:"User fetched successfully",
            success:true,
            user,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            success: false
        });
    }
}

// export const deleteUserProfile = async (req,res) => {
//     try {
//         await User.findByIdAndDelete(req.user._id);
//         return res.status(200).json({
//             message:"User deleted successfully",
//             success:true,
//         })
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "An internal server error occurred.",
//             success: false
//         });
//     }
// }
