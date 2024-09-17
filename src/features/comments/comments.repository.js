import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";


export default class CommentRepository{
    async addComment(userID,postID,comment){
        try{
            const db=getDB();
            const collection=db.collection("comments");
            const newComment = {
                userID: new ObjectId(userID),
                postID: new ObjectId(postID),
                comment: comment
            };
            await collection.insertOne(newComment);
            return newComment;
        }catch(err){
            throw new ApplicationError("Database issue",500);
        }
    }

    async getComment(postID){
        try{
            const db=getDB();
            const collection=db.collection("comments");
            const result=await collection.find({ postID: new ObjectId(postID)}).toArray();
            return result;
        }catch(err){
            throw new ApplicationError("Database issue",500);
        }
    }

    async deleteComment(commentID, userID) {
        try {
            const db = getDB();
            const commentsCollection = db.collection("comments");
            const postsCollection = db.collection("posts");
    
            // Find the comment in the comments collection
            const comment = await commentsCollection.findOne({ _id: new ObjectId(commentID) });
            console.log("comment",comment);
    
            if (!comment) {
                return "Comment not found";
            }
            
            console.log(comment.userID);
            console.log(new ObjectId(userID));
            // Check if the userID matches the userID associated with the comment
            if (comment.userID == new ObjectId(userID).toString()) {
                // If userID matches, delete the comment
                return await commentsCollection.deleteOne({ _id: new ObjectId(commentID) });
            } else {
                // If userID doesn't match, find the associated post
                const post = await postsCollection.findOne({ _id: comment.postID });
                console.log("post",post);
    
                if (!post || post.userID != new ObjectId(userID).toString()) {
                    // If post not found or userID doesn't match the post's userID, return "comment not found"
                    return "Comment either doesn't belong to your post, or this is not your comment";
                } else {
                    // If userID matches the post's userID, delete the comment
                    return await commentsCollection.deleteOne({ _id: new ObjectId(commentID) });
                }
            }
        } catch (err) {
            throw new ApplicationError("Database issue", 500);
        }
    }

    async updateComment(userID, commentID, newComment) {
        try {
            const db = getDB();
            const collection = db.collection("comments");
    
            // Find the comment in the comments collection
            const comment = await collection.findOne({ _id: new ObjectId(commentID), userID: new ObjectId(userID) });
            console.log(comment);
    
            if (!comment) {
                return false;
            }
    
            // Update the comment with newComment
            await collection.updateOne(
                { _id:  new ObjectId(commentID)},
                { $set: { comment: newComment } }
            );
    
            return true;
        } catch (err) {
            throw new ApplicationError("Database issue", 500);
        }
    }
    
    
}