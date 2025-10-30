import experss from "express";
import { Expense } from "../models/expense.model.js";

// Add Expense
const addExpense = async (req, res) => {
    try {
        const {amount, title,  description, category, date} = req.body;
        if(!amount || !title || !description || !category || !date){
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        const expense = await Expense.create({
            amount,title,category,description,date,
            userId:req.user._id,
        });
        res.status(201).json({
            message: "Expense added successfully",
            success: true,
            expense});

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            success: false
        });
    }
}


// Get Expenses
const getExpenses = async (req,res) => {
    try {
        const expenses = await Expense.find({userId:req.user._id}).sort({date:-1});
        return res.status(200).json({
            message: "Expenses fetched successfully",
            success: true,
            expenses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            success: false
        });
    }   
}


// Delete Expense
const deleteExpense = async (req,res) => {
    try {
        const {id} = req.params;
        const expense = await Expense.findById(id);
        if(!expense){
            return res.status(404).json({
                message: "Expense not found",
                success: false
            });
        }
        if(expense.userId.toString() !== req.user._id.toString()){
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            });
        } 
        await Expense.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Expense deleted successfully",
            success: true
        });  
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            success: false
        });
    }
}


// Update Expense
const updateExpense = async (req,res) => {
    try {
        const {id} = req.params;
        const expense = await Expense.findById(id);
        if(!expense){
            return res.status(404).json({
                message:"Expense not found",
                status:false
            });
        }
        if(expense.userId.toString()!= req.user._id.toString()){
            return res.status(401).json({
                message:"Unauthorized",
                success:false
            });
        }
        const {amount, title, description, category, date} = req.body;
        const updatedExpense =  await Expense.findByIdAndUpdate(id,{
            amount, title, description, category, date
        },{ new: true, runValidators: true });
        return res.status(200).json({
            message:"Expense updated successfully",
            success:true,
            updatedExpense,
        });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"An internal server error occurred.",
            success:false
        });
    }
}

// Get Aggregated Expenses
const getAggregatedExpenses = async (req, res) => {
    try {
        const userId = req.user._id;
        const matchStage = userId ? userId : null;
        const aggregatedData = await Expense.aggregate([
            { $match: { userId: matchStage} },
            { $group: {
                _id: {$toLower:"$category"},
                totalAmount: { $sum: "$amount" },
            }},
            { $sort: { totalAmount: -1 } },
        ]);

        const totalSum = aggregatedData.reduce((acc, curr) => acc + curr.totalAmount, 0);

        return res.status(200).json({
            message: "Aggregated expenses fetched successfully",
            success: true,
            data: aggregatedData,
            totalSum,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            success: false,
        });
    }
}; 

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    
    const categoryData = await Expense.aggregate([
      { $match: { userId } }, 
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    
    const monthlyData = await Expense.aggregate([
      { $match: { userId } }, // ✅ same fix here
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    
    const totalExpenses = categoryData.reduce((acc, cur) => acc + cur.total, 0);
    const totalTransactions = await Expense.countDocuments({ userId });

    
    const topCategory =
      categoryData.length > 0
        ? categoryData.reduce((a, b) => (a.total > b.total ? a : b))._id
        : null;

    
    res.status(200).json({
      success: true,
      message: "Expense analytics fetched successfully",
      totalExpenses,
      totalTransactions,
      topCategory,
      categoryBreakdown: categoryData,
      monthlyData: monthlyData.map((m) => ({
        _id: getMonthName(m._id),
        total: m.total,
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics data",
    });
  }
};


function getMonthName(monthNumber) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return months[monthNumber - 1] || "";
}



export {addExpense, getExpenses, deleteExpense, updateExpense,getAggregatedExpenses};

