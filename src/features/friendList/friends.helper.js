import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";

export async function changeFriendStatus(userID, friendID, action) {
    const db = getDB();
    const userCollection = db.collection("friends");

    if (action == "add") {
        console.log("userID",userID);
        const user = await userCollection.findOne({ userID: new ObjectId(userID) });
        if(!user){
            return;
        }
        console.log("inside add action",user);

        // if user.friendList doesn't exist
        if (!user.friendList) {
            console.log("userID doesn't have friendList Array");
            await userCollection.updateOne(
                { userID: new ObjectId(userID) },
                {
                    $set: {
                        friendList: [{ userID: new ObjectId(friendID), status: "friend request sent" }]
                    }
                }
            );
            return;
        // if user.friendList exists
        } else {
            // push friendID
            await userCollection.updateOne(
                { userID: new ObjectId(userID) },
                {
                    $push: {
                        friendList: {
                            userID: new ObjectId(friendID),
                            status: "friend request sent"
                        }
                    }
                }
            );
        }
    } else {
        await userCollection.updateOne(
            { userID: new ObjectId(userID) },
            { $pull: { friendList: { userID: new ObjectId(friendID) } } }
        );
    }
}

export async function acceptOrReject(userID,friendID,action){
    const db = getDB();
    const userCollection = db.collection("friends");
    console.log("Inside accept or reject helper");
    const friend=await userCollection.findOne({ userID: new ObjectId(friendID) });
    console.log(friend);
    if(!friend){
        return;
    }

    const userIndex = friend.friendList.findIndex((f) => f.userID.toString() === new ObjectId(userID).toString());
    if(userIndex==-1){
        return;
    }

    if (action === "yes") {
        console.log("changing user to accepted");
        friend.friendList[userIndex].status = "friends";
    } else {
        console.log("deleting user");
        friend.friendList.splice(userIndex, 1);
    }
    
    await userCollection.updateOne(
        { userID: new ObjectId(friendID) },
        { $set: { friendList: friend.friendList } }
    );
    

}
