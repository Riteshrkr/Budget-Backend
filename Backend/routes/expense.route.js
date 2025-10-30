import express from "express";
import { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { addExpense, deleteExpense, getAggregatedExpenses, getExpenses, updateExpense ,getAnalytics} from "../controller/expense.controller.js";

const router = express.Router();

router.route("/").post(isAuthenticated,addExpense);
router.route("/").get(isAuthenticated,getExpenses);
router.get("/summary", isAuthenticated, getAggregatedExpenses);
router.get("/analytics", isAuthenticated, getAnalytics);
router.route("/:id").delete(isAuthenticated,deleteExpense);
router.route("/:id").put(isAuthenticated,updateExpense);

export default router;