import express from "express"
import { Router } from "express";
import { Register,Login,Logout, getUserProfile } from "../controller/user.controller.js";
import {isAuthenticated} from "../middleware/isAuthenticated.js"

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").post(Logout);
router.route("/profile").get(isAuthenticated, getUserProfile);

export default router;