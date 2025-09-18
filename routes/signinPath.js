import {Login } from "../controllers/SigninController.js"
import express from "express";

const userRouter =express();
userRouter.post("/login", Login);


export default userRouter;