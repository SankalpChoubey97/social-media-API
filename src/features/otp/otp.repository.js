import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import bcrypt from 'bcrypt';
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OTPRepository{
    async getOTP(email) {
        try {
            const db = getDB();
            const collection = db.collection("otp");
    
            // Generate a 6 digit random number
            const otp = Math.floor(100000 + Math.random() * 900000);
            const hashedOTP = await bcrypt.hash(otp.toString(), 12);
    
            // Check if otp collection already has a record with the given email
            const existingOTP = await collection.findOne({ email: email });
    
            if (existingOTP) {
                // If OTP already exists for the email, update it, also remove validate field from it
                await collection.updateOne({ email: email }, { $set: { otp: hashedOTP }, $unset: { validated: "" } });
            } else {
                // If OTP doesn't exist for the email, create a new record
                await collection.insertOne({ email: email, otp: hashedOTP });
            }
    
            // Set timeout to delete OTP after 15 minutes
            setTimeout(async () => {
                await collection.deleteOne({ email: email });
                console.log("OTP deleted from collection after 15 minutes");
            }, 15 * 60 * 1000);
    
            return otp;
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 404);
        }
    }

    async validateOTP(email,otp){
        try{
            const db = getDB();
            const collection = db.collection("otp");

            console.log("email",email);

            const user = await collection.findOne({ email: email });
            console.log("users",user);

            if(!user){
                return {message:"no user found",code:404};
            }

            const result = await bcrypt.compare(otp.toString(), user.otp);
            if(!result){
                return {message:"Otp you've entered is either wrong or expired, please enter correct otp",code:400}
            }

            //if result is true, add validated to current user collection and set it true
            await collection.updateOne({ email: email }, { $set: { validated: true } });

            return {message:"Otp validated, you can proceed to change password now",code: 200}
        }catch(err){
            throw new ApplicationError("Something went wrong with database", 404);
        }
    }

    async resetPassword(email, password) {
        try {
            const db = getDB();
            const userCollection = db.collection("users");
            const otpCollection = db.collection("otp");
    
            // Get user by email from otp
            const user = await otpCollection.findOne({ email: email });
    
            // If no user found, return {message:"No email found",code:400}
            if (!user) {
                return { message: "No email found", code: 400 };
            }
    
            // If user found, check if user.validated is true, if not true return {message:"Otp not validated",code:400}
            console.log(user.validated);
            if (user.validated!=true) {
                return { message: "OTP not validated", code: 400 };
            }
    
            // Delete the document from the otp collection
            await otpCollection.deleteOne({ email: email });
    
            // In user collection, update password for which the email matches
            await userCollection.updateOne({ email: email }, { $set: { password: password } });
    
            return { message: "Password reset successfully", code: 200 };
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
    
    

    
}