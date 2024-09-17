import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";


export default class LikeRepository{

    async toggleLikes(userID, id) {
        try {
            const db = getDB();
            const postCollection = db.collection("posts");
            const post = await postCollection.findOne({ _id: new ObjectId(id) });
            
            //if id is found in post collection
            if (post) {
                //if likes array isn't found inside the post
                if (!post.likes) {
                    await postCollection.updateOne(
                        { _id: new ObjectId(id) },
                        { $set: { likes: [{ userID: new ObjectId(userID) }] } }
                    );
                    return { message: "Liked the post", code: 200 };
                //if likes array is found inside the post
                } else {
                    //find userID in the likes array
                    const likedIndex = post.likes.findIndex((like) => like.userID.toString() === new ObjectId(userID).toString());
                    
                    //if userID is not found
                    if (likedIndex === -1) {
                        await postCollection.updateOne(
                            { _id: new ObjectId(id) },
                            { $push: { likes: { userID: new ObjectId(userID) } } }
                        );
                        return { message: "Liked the post", code: 200 };
                    //if userID is found
                    } else {
                        await postCollection.updateOne(
                            { _id: new ObjectId(id) },
                            { $pull: { likes: { userID: new ObjectId(userID) } } }
                        );
                        return { message: "Like removed from the post", code: 200 };
                    }
                }
            } 
            //id is not found in post collection
            else {
                const commentCollection = db.collection("comments");
                const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
    
                if (comment) {
                    if (!comment.likes) {
                        await commentCollection.updateOne(
                            { _id: new ObjectId(id) },
                            { $set: { likes: [{ userID: new ObjectId(userID) }] } }
                        );
                        return { message: "Liked the comment", code: 200 };
                    } else {
                        const likedIndex = comment.likes.findIndex((like) => like.userID.toString() === new ObjectId(userID).toString());
    
                        if (likedIndex === -1) {
                            await commentCollection.updateOne(
                                { _id: new ObjectId(id) },
                                { $push: { likes: { userID: new ObjectId(userID) } } }
                            );
                            return { message: "Liked the comment", code: 200 };
                        } else {
                            await commentCollection.updateOne(
                                { _id: new ObjectId(id) },
                                { $pull: { likes: { userID: new ObjectId(userID) } } }
                            );
                            return { message: "Like removed from the comment", code: 200 };
                        }
                    }
                } else {
                    return { message: "ID not found", code: 404 };
                }
            }
        } catch (err) {
            throw new ApplicationError("Database issue", 500);
        }
    }

    async getLikes(id) {
        try {
            const db = getDB();
            const postCollection = db.collection("posts");
            const post = await postCollection.findOne({ _id: new ObjectId(id) });
    
            if (post) {
                const likesCount = post.likes ? post.likes.length : 0;
                return { message: likesCount, code: 200 };
            } else {
                const commentCollection = db.collection("comments");
                const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
    
                if (comment) {
                    const likesCount = comment.likes ? comment.likes.length : '0';
                    return { message: likesCount, code: 200 };
                } else {
                    return { message: "ID not found", code: 404 };
                }
            }
        } catch (err) {
            throw new ApplicationError("Database issue", 500);
        }
    }
    
    
    
}