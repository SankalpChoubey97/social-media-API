import express from "express";
import UserController from "./user.controller.js";
import {upload} from "../../middlewares/fileupload.middleware.js"
import { validate } from "../../middlewares/fieldvalidation.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

const userRouter=express.Router(); 
const userController=new UserController();

userRouter.post("/signup",upload.single('avatar'),validate,(req,res,next)=>{
    userController.signUp(req,res,next)});

userRouter.post("/signin",(req,res,next)=>{
    userController.signIn(req,res,next)});

userRouter.delete("/logout",jwtAuth,(req,res)=>{
    userController.signOut(req,res)});

userRouter.delete("/logout-all-devices",jwtAuth,(req,res)=>{
    userController.signOutAll(req,res)});

userRouter.get("/get-all-details",jwtAuth,(req,res)=>{
    userController.getAllDetails(req,res)});

userRouter.post("/update-details",jwtAuth,upload.single('avatar'),(req,res,next)=>{
    userController.updateDetails(req,res,next)});

userRouter.get("/get-details/:userID",jwtAuth,(req,res,next)=>{
    userController.getDetails(req,res,next)});

export default userRouter;      