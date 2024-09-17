import { ObjectId } from 'mongodb';
import { getDB } from '../config/mongodb.js';


export const commentValidate =(req, res, next) => {
    const { comment } = req.body;
    console.log(comment);

    // Check if comment is defined and not an empty string
    if (!comment || comment.trim() === "") {
        return res.status(400).send("Comment cannot be empty");
    }

    next();
    
};

export const postValidate = async (req, res, next) => {
    const postID = req.params.postID;
    console.log(postID);

    try {
        const db = getDB();
        const collection = db.collection("posts");

        // Check if post exists
        const post = await collection.findOne({ _id: new ObjectId(postID)});
        if (!post) {
            return res.status(400).send("Post not found");
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send("Database issue");
    }
}

