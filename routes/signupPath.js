import {Register } from "../controllers/SignupController.js"
import express from "express";

const userRouter =express();
userRouter.post("/SignupForm", Register);


export default userRouter;