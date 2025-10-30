import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req,res,next) => {
  try {
      const token = req.cookies.token;
      if(!token){
          return res.status(401).json({
                  message:'User not authenticated',
                  success:false
              });
      }
      const decode = jwt.verify(token,process.env.SECRET_KEY);
      const user = await User.findById(decode._id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    req.user = user;
      next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
    message: "An internal server error occurred.",
    success: false
  });
  }
}