import FriendsRepository from "./friends.repository.js";

export default class FriendsController{
    constructor(){
        this.friendsRepository=new FriendsRepository();
    }

    async toggleRequest(req,res,next){
        try{
            console.log("Inside toggle Request controller");
            const userID=req.userID;
            const friendID=req.params.friendId;
            console.log("friendID",friendID);
            const result=await this.friendsRepository.toggleFriendRequest(userID,friendID);
            return res.status(result.code).send(result.message);
        }catch(err){
            console.log("Inside toggle request controller error");
            next(err);
        }
    }

    async responseToRequest(req,res,next){
        try{
            console.log("Inside response to request controller");
            const userID=req.userID;
            const friendID=req.params.friendId;
            const {action}=req.body;
            const result=await this.friendsRepository.responseToRequest(userID,friendID,action);
            return res.status(result.code).send(result.message);
        }catch(err){
            console.log("Inside response to Request controller error");
            next(err);
        }
    }

    async getAllFriends(req,res,next){
        try{
            console.log("inside get friends controller");
            const userID=req.userID;
            const result=await this.friendsRepository.getAllFriends(userID);
            return res.status(200).send(result);
        }catch(err){
            console.log("Inside get all friends error controller");
            next(err);
        }
    }

    async pendingRequests(req,res,next){
        try{
            const userID=req.userID;
            const result=await this.friendsRepository.getPendingRequests(userID);
            return res.status(200).send(result);
        }catch(err){
            console.log("Inside get all pending requests error controller");
            next(err);
        }
    }
}