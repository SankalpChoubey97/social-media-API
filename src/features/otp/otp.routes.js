import express from "express";
import { emailValidate, passwordValidate } from "../../middlewares/otp.middleware.js";
import OTPController from "./otp.controller.js";

const otpRouter=express.Router(); 
const otpController=new OTPController();

otpRouter.post("/send",emailValidate,(req,res,next)=>{
    otpController.generateOTP(req,res,next)});

otpRouter.get("/verify",(req,res,next)=>{
    otpController.validateOTP(req,res,next)});

otpRouter.post("/reset-password",passwordValidate,(req,res,next)=>{
    otpController.resetPassword(req,res,next)});

export default otpRouter;