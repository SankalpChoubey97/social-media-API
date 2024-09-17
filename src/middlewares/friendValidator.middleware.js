import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";
import { ApplicationError } from "../error-handler/applicationError.js";

export const friendIDvalidate = async (req, res, next) => {
    try {
        const db = getDB();
        const collection = db.collection("friends");

        const friendID = req.params.friendId;
        const userID = req.userID;

        if (!userID || !friendID) {
            return res.status(400).send("User ID or Friend ID not provided");
        }

        if (userID === friendID) {
            return res.status(400).send("You can't send a friend request to yourself. Please specify another person's user ID.");
        }

        const user = await collection.findOne({ userID: new ObjectId(userID) });

        if (!user || !user.friendList) {
            return next();
        }

        const friend = user.friendList.find(friend => friend.userID.toString() === friendID);

        if (!friend) {
            return next();
        }

        if (friend.status === "friend request pending") {
            return res.status(400).send("You can't delete this request. Either accept or reject it.");
        }

        next();
    } catch (error) {
        console.log("inside toggleFriend error middleware");
        throw new ApplicationError("Database issue",404);
    }
}

export const actionvalidate = async (req, res, next) => {
    const {action}=req.body;
    if(!action){
        return res.status(400).send("Action field is mandatory, enter either yes or no");
    }

    if(action=="yes"||action=="no"){
        return next();
    }

    return res.status(400).send("Enter yes or no is action field");
}
