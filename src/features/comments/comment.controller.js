import CommentRepository from "./comments.repository.js";


export default class CommentController{
    constructor(){
        this.commentRepository=new CommentRepository();
    }

    async addComment(req,res,next){
        try{
            const userID=req.userID;
            const postID=req.params.postID;
            const {comment}=req.body;
            const result=await this.commentRepository.addComment(userID,postID,comment);
            return res.status(200).send(result);
        }catch(err){
            console.log("Inside add comment error controller");
            next(err);
        }
    }

    async getComment(req,res,next){
        try{
            const postID=req.params.postID;
            console.log("postID",postID)
            const comments=await this.commentRepository.getComment(postID);
            if(comments.length>0){
                return res.status(200).send(comments);
            }else{
                return res.status(400).send("No comments on this post");
            }
        }catch(err){
            console.log("Inside get comment error controller");
            next(err);
        }
    }

    async deleteComment(req,res,next){
        try{
            const userID=req.userID;
            const commentID=req.params.commentID;
            const deleted=await this.commentRepository.deleteComment(commentID,userID);
            return res.send(deleted);
        }catch(err){
            console.log("Inside delete comment error controller");
            next(err);
        }
    }

    async updateComment(req,res,next){
        try{
            const userID=req.userID;
            const commentID=req.params.commentID;
            const {comment}=req.body
            const updated=await this.commentRepository.updateComment(userID,commentID,comment);
            if(updated){
                return res.status(200).send("Comment updated");
            }else{
                return res.status(400).send("Comment not found");
            }
        }catch(err){
            console.log("Inside update comment error controller");
            next(err);
        }
    }
}