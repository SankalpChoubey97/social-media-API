import express from "express";
import CommentController from "./comment.controller.js";
import { commentValidate, postValidate } from "../../middlewares/comment.middleware.js";

const commentRouter=express.Router(); 
const commentController=new CommentController();

commentRouter.post("/:postID",postValidate,commentValidate,(req,res,next)=>{
    commentController.addComment(req,res,next)});

commentRouter.get("/:postID",postValidate,(req,res,next)=>{
    commentController.getComment(req,res,next)});

commentRouter.delete("/:commentID",(req,res,next)=>{
    commentController.deleteComment(req,res,next)});

commentRouter.put("/:commentID",commentValidate,(req,res,next)=>{
    commentController.updateComment(req,res,next)});

export default commentRouter;      