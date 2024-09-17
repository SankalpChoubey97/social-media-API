import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class PostRepository{
    //get all posts
    async getPost(){
        try{
            const db=getDB();
            const collection=db.collection("posts");
            return await collection.find().toArray();
        }catch(err){
            throw new ApplicationError("Database issue",500);
        }
    }
    //post by id
    async getPostById(id){
        try{
            const db=getDB();
            const collection=db.collection("posts");
            const post=await collection.findOne({_id:new ObjectId(id)});

            if (!post) {
                throw new ApplicationError("Post not found", 404);
            }

            return post;
        }catch(err){
            throw new ApplicationError("Post not found",500);
        }
    }
    //get posts by userID
    async getPostByUser(userID){
        try{
            const db=getDB();
            const collection=db.collection("posts");
            return await collection.find({ userID: new ObjectId(userID)}).toArray();
        }catch(err){
            throw new ApplicationError("Database issue",404);
        }
    }

    async createPost(userID,caption,imageURL){
        try{
            const db=getDB();
            const collection=db.collection("posts");
            console.log("Inside create post repository");
            // Create post object
            const post = {
                userID: new ObjectId(userID),
                caption: caption,
                imageURL: imageURL
            };

            // Insert post into the collection
            await collection.insertOne(post);

            return post;
        }catch(err){
            throw new ApplicationError("Database issue",404);
        }
    }

    async deletePost(id,userID){
        try{
            const db=getDB();
            const collection=db.collection("posts");
            console.log("postID",id);
            console.log("userID",userID);
            const result = await collection.deleteOne({ _id: new ObjectId(id), userID: new ObjectId(userID) });
            
            if(result.deletedCount>0){
                //delete all collections which has postID: new ObjectId(id)
                await db.collection("comments").deleteMany({ postID: new ObjectId(id) });
            }
                
            console.log("result",result);
        
            if (result.deletedCount === 0) {
                return 0;
            }else{
                return 1;
            }
        }catch(err){
            throw new ApplicationError("Database issue",404);
        }
    }

    async updatePost(id,userID,imageURL,caption){
        try{
            const db=getDB();
            const collection=db.collection("posts");
            const update = {};
            // Create the update object
            if (caption) update.caption = caption;
            if (imageURL) update.imageURL = imageURL;

            // Update the post
            const result = await collection.updateOne(
                { _id: new ObjectId(id), userID: new ObjectId(userID) },
                { $set: update }
            );
            
            if (result.modifiedCount === 0) {
                return 0;
            }else{
                return 1;
            }
        }catch(err){
            throw new ApplicationError("Database issue",404);
        }
    }

}