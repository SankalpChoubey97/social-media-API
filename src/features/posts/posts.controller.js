
import PostRepository from "./posts.repository.js";

export default class PostController{
    constructor(){
        this.postRepository=new PostRepository();
    }

    //get all posts
    async getPost(req,res,next){
        try{
            const posts=await this.postRepository.getPost();
            return res.status(200).send(posts);
        }catch(err){
            console.log("Inside get Post controller error");
            next(err);
        }
    }
    //post by id
    async getPostById(req,res,next){
        try{
            const id=req.params.postId;
            const post=await this.postRepository.getPostById(id);
            return res.status(200).send(post);
        }catch(err){
            console.log("Inside get post by id controller error");
            next(err);
        }
    }
    //get posts by userID
    async getPostByUser(req,res,next){
        try{
            const userID=req.params.userID;
            const posts=await this.postRepository.getPostByUser(userID);
            return res.status(200).send(posts);
        }catch(err){
            console.log("Inside get post by user controller error");
            next(err);
        }
    }
    //create post
    async createPost(req, res, next) {
        try {
            let { caption, imageURL } = req.body;
            const userID = req.userID;
            let post;
            
            //if image is uploaded, using multer assigning image URL
            if (!imageURL && req.file) {
                imageURL = req.file.filename;
            }
    
            post = await this.postRepository.createPost(userID, caption, imageURL);
            return res.status(200).send(post);
        } catch (err) {
            console.log("Inside create post controller error:", err);
            next(err);
        }
    }
    
    //delete post
    async deletePost(req,res,next){
        try{
            const userID=req.userID;
            const id=req.params.postID;
            const deleted=await this.postRepository.deletePost(id,userID);
            if(deleted==1)
            {
                return res.status(200).send("Post deleted");
            }else{
                return res.status(400).send("Post not found");
            }
        }catch(err){
            console.log("Inside delete post controller error");
            next(err);
        }
    }
    //update post
    async updatePost(req, res, next) {
        try {
            const userID = req.userID;
            let { id, caption, imageURL } = req.body;
    
            let update;
            //if image file is provided, add image using multer
            if (!imageURL && req.file) {
                imageURL = req.file.filename;
            }
    
            update = await this.postRepository.updatePost(id, userID, imageURL, caption);
    
            if (update === 1) {
                return res.status(200).send("Post updated");
            } else {
                return res.status(400).send("Post not found");
            }
        } catch (err) {
            console.log("Inside update post controller error:", err);
            next(err);
        }
    }
    
}