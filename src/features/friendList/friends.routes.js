import express from "express";
import FriendsController from "./friends.controller.js";
import { actionvalidate, friendIDvalidate } from "../../middlewares/friendValidator.middleware.js";

const friendsRouter=express.Router(); 
const friendsController=new FriendsController();

friendsRouter.post("/toggle-friendship/:friendId",friendIDvalidate,(req,res,next)=>{
    friendsController.toggleRequest(req,res,next)});

friendsRouter.post("/response-to-request/:friendId",actionvalidate,(req,res,next)=>{
    friendsController.responseToRequest(req,res,next)});

friendsRouter.get("/get-friends",(req,res,next)=>{
    friendsController.getAllFriends(req,res,next)});

friendsRouter.get("/get-pending-requests",(req,res,next)=>{
    friendsController.pendingRequests(req,res,next)});

export default friendsRouter;   