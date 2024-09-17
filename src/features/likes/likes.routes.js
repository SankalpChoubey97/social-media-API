import express from "express";
import LikesController from "./likes.controller.js";

const likeRouter=express.Router(); 
const likeController=new LikesController();

likeRouter.post("/:ID",(req,res,next)=>{
    likeController.toggleLikes(req,res,next)});

likeRouter.get("/:ID",(req,res,next)=>{
    likeController.getLikes(req,res,next)});

export default likeRouter;      