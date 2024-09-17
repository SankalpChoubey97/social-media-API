import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { acceptOrReject, changeFriendStatus } from "./friends.helper.js";

export default class FriendsRepository{

    async toggleFriendRequest(userID,friendID){
        try{
            const db = getDB();
            const userCollection = db.collection("friends");
            const friend = await userCollection.findOne({ userID: new ObjectId(friendID) });
            console.log(friend);
            //check if the friend exist
            if(friend){
                console.log("friend ID found");
                //check if the friend has a friendList array, if it doesn't have it
                if(!friend.friendList){
                    console.log("FriendID doesn't have friendList array");
                    //add friendship status to friend
                    await userCollection.updateOne(
                        { userID: new ObjectId(friendID) },
                        { $set: { 
                            friendList: [{ userID: new ObjectId(userID),status: "friend request pending" }] } }
                    );

                    //add friendship status to user
                    await changeFriendStatus(userID,friendID,"add");
                    return { message: "friend request sent", code: 200 };
                }
                //if the friend has the friend array
                else{
                    //find userID in the friendList array
                    const friendIndex = friend.friendList.findIndex((f) => f.userID.toString() === new ObjectId(userID).toString());
                    //if user doesn't exist in friendList
                    if(friendIndex==-1){
                        //add user in friendList
                        await userCollection.updateOne(
                            { userID: new ObjectId(friendID) },
                            { $push: { 
                                friendList: { 
                                    userID: new ObjectId(userID),
                                    status: "friend request pending"
                                } 
                            } }
                        );

                        //add friendship status to user as well
                        await changeFriendStatus(userID,friendID,"add");
                        return { message: "friend request sent", code: 200 };
                    }
                    //if user exist in friendList
                    else{
                        //remove the friendIndex from the friendList
                        await userCollection.updateOne(
                            { userID: new ObjectId(friendID) },
                            { $pull: { friendList: { userID: new ObjectId(userID) } } }
                        );

                        //remove friendship status to user as well
                        await changeFriendStatus(userID,friendID,"delete");
                        return { message: "friend request deleted", code: 200 };
                    }
                }
            }else{
                return { message: "friendID not found", code: 404 };
            }
        }catch(err){
            throw new ApplicationError("Database issue",404);
        }
    }

    async responseToRequest(userID, friendID, action) {
        try {
            const db = getDB();
            const userCollection = db.collection("friends");
            console.log("Inside response to request repository");
            console.log("userID:",userID);
            // Find collection for userID
            const user = await userCollection.findOne({ userID: new ObjectId(userID) });
            console.log(user.friendList);
    
            // If friendList array doesn't exist, return "no friend found with this friendID"
            if (!user.friendList) {
                console.log("no friendList array");
                return { message: "No pending request found with this friendID", code: 400 };
            }
    
            // Check inside the array if friendID exists
            const friendIndex = user.friendList.findIndex((f) => f.userID.toString() === new ObjectId(friendID).toString());
            console.log(friendIndex);
            // If it doesn't exist, return "no friend found with this friendID"
            if (friendIndex === -1) {
                console.log("no such friend found");
                return { message: "No pending request found with this friendID", code: 400 };
            }
    
            // If it exists, check if status: "friend request pending"
            if (user.friendList[friendIndex].status !== "friend request pending") {
                console.log("request is not in pending state");
                return { message: "Can't take action on this friendID, either because you are already friends, or you have sent friend request to the friendID", code: 400 };
            }
    
            // If status: "friend request pending"
            if (action === "yes") {
                console.log("adding friend");
                // Change status: "friends"
                user.friendList[friendIndex].status = "friends";
                // Update user document with the modified friendList
                await userCollection.updateOne(
                    { userID: new ObjectId(userID) },
                    { $set: { friendList: user.friendList } }
                );

                await acceptOrReject(userID,friendID,action);
                return { message: "Friend request accepted", code: 200 };
            } else{
                console.log("deleting friend");
                // Delete this array index
                user.friendList.splice(friendIndex, 1);
                // Update user document with the modified friendList
                await userCollection.updateOne(
                    { userID: new ObjectId(userID) },
                    { $set: { friendList: user.friendList } }
                );
                await acceptOrReject(userID,friendID,action);
                return { message: "Friend request rejected", code: 200 };
            }
        } catch (err) {
            throw new ApplicationError("Database issue", 404);
        }
    }

    async getAllFriends(userID) {
        try {
            const db = getDB();
            const userCollection = db.collection("friends");

            const user = await userCollection.findOne({ userID: new ObjectId(userID) });
            const friendArray = [];
    
            if (user && user.friendList) {
                user.friendList.forEach(friend => {
                    if (friend.status === "friends") {
                        friendArray.push(friend);
                    }
                });
            }
    
            return friendArray;
        } catch (err) {
            throw new ApplicationError("Database issue", 404);
        }
    }

    async getPendingRequests(userID){
        try {
            const db = getDB();
            const userCollection = db.collection("friends");
    
            const user = await userCollection.findOne({ userID: new ObjectId(userID) });
            const pendingRequestArray = [];
    
            if (user && user.friendList) {
                user.friendList.forEach(friend => {
                    if (friend.status != "friends") {
                        pendingRequestArray.push(friend);
                    }
                });
            }
    
            return pendingRequestArray;
        } catch (err) {
            throw new ApplicationError("Database issue", 404);
        }
    }
    
}
    


