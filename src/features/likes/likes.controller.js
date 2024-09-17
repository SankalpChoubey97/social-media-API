import LikeRepository from "./likes.repository.js";

export default class LikesController{
    constructor(){
        this.likeRepository=new LikeRepository();
    }

    async toggleLikes(req,res,next){
        try{
            const id=req.params.ID;
            const userID=req.userID;
            const result=await this.likeRepository.toggleLikes(userID,id);
            return res.status(result.code).send(result.message);
        }catch(err){
            console.log("Inside toggle likes error controller");
            next(err);
        }
    }

    async getLikes(req,res,next){
        try{
            const id=req.params.ID;
            const result = await this.likeRepository.getLikes(id);
            const message = typeof result.message === "number" ? result.message.toString() : result.message;
            return res.status(result.code).send(message);

        }catch(err){
            console.log("Inside get likes error controller");
            next(err);
        }
    }
}