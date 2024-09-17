import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import bcrypt from 'bcrypt';

export default class UserRepository{
    async signUp(newUser){
        try{
            const db = getDB();
            const userCollection = db.collection("users");
            const friendCollection = db.collection("friends");
            //inserting newUser in users collection
            const result = await userCollection.insertOne(newUser);
            // Inserting into the friends collection, this is for friend request functionality
            await friendCollection.insertOne({ userID: result.insertedId });
            return newUser;
        }catch(err){
            throw new ApplicationError("Database issue",404);
        }
    }

    async findByEmail(email){
        try{
            const db=getDB();
            const collection=db.collection("users");
            return await collection.findOne({email});
        }catch(err){
        }
    }

    async addToken(token,userID){
        try{
            const db=getDB();
            const collection=db.collection("token");
            await collection.insertOne({token,userID});
            console.log("token added in db");
        }catch(err){
            throw new ApplicationError("Database issue",404);
        }
    }

    async signOut(token, userID) {
        try {
            const db = getDB();
            const collection = db.collection("token");
            console.log("token", token);
            console.log("userID", userID);
    
            // Delete collection containing token and userID: new ObjectId(userID) 
            const result = await collection.deleteOne({ userID: new ObjectId(userID), token });
    
            // Return appropriate response
            if (result.deletedCount === 1) {
                // Token deleted successfully
                return { message: "Logged out successfully", code: 200 };
            } else {
                // Token not found
                return { message: "Token not found", code: 400 };
            }
        } catch (err) {
            throw new ApplicationError("Database issue", 404);
        }
    }
    
    

    async signOutAll(userID) {
        try {
            const db = getDB();
            const collection = db.collection("token");
            const result = await collection.deleteMany({ userID: new ObjectId(userID) });
            
            if(result.deletedCount > 0) {
                // Token deleted successfully
                return true;
            } else {
                // Token not found
                return false;
            }
        } catch(err) {
            throw new ApplicationError("Database issue", 404);
        }
    }
    

    async findById(userID){
        try{
            const db=getDB();
            const collection=db.collection("users");
            return await collection.findOne(
                { _id: new ObjectId(userID) },
                { projection: { password: 0 } } // Exclude the password field
            );
        }catch(err){
            console.log(err);
            throw new ApplicationError("Database issue",404);
        }
    }

    async getAll() {
        try {
            const db = getDB();
            const collection = db.collection("users");
            return await collection.find(
                {}, // Empty filter to get all documents
                { projection: { password: 0 } } // Exclude the password field
            ).toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Database issue",404);
        }
    }

    async updateDetails(userID, name, age, gender, avatar) {
        try {
            const db = getDB();
            const collection = db.collection("users");
    
            // Construct update object based on provided values
            const updateObj = {};
            if (name) updateObj.name = name;
            if (age !== "" && !isNaN(age)) updateObj.age = parseInt(age);
            if (gender !== null && gender !== undefined) updateObj.gender = gender;
            if (avatar) updateObj.avatar = avatar;
    
            // Update the user details
            const result = await collection.updateOne(
                { _id: new ObjectId(userID) },
                { $set: updateObj }
            );

            console.log("result: ",result);
    
            if (result.modifiedCount === 0) {
                throw new ApplicationError("User not found", 404);
            }
    
        } catch (err) {
            throw new ApplicationError("Database issue", 500); // Change 404 to 500
        }
    }
    }
    