import express from "express";
import {upload} from "../../middlewares/fileupload.middleware.js"
import PostController from "./posts.controller.js";

const postRouter=express.Router(); 
const postController=new PostController();

//get all posts
postRouter.get("/all",(req,res,next)=>{
    postController.getPost(req,res,next)});
//get posts by userID
postRouter.get("/users/:userID",(req,res,next)=>{
    postController.getPostByUser(req,res,next)});
//get post by ID
postRouter.get("/:postId",(req,res,next)=>{
    postController.getPostById(req,res,next)});
//createPost
postRouter.post("/",upload.single('imageURL'),(req,res,next)=>{
    postController.createPost(req,res,next)});
//deletePost
postRouter.delete("/:postID",(req,res,next)=>{
    postController.deletePost(req,res,next)});
//update post    
postRouter.put("/update",upload.single('imageURL'),(req,res,next)=>{
    postController.updatePost(req,res,next)});

export default postRouter;      