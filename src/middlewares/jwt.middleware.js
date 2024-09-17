import jwt from "jsonwebtoken";
import { getDB } from "../config/mongodb.js";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";

const jwtAuth = async (req, res, next) => {
    // read the token
    console.log("request headers", req.headers);
    const token = req.headers["authorization"];

    // if no token, return error
    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    // check if token is valid
    try {
        //jwt verification
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("payload", payload);
        req.userID = payload.userID;

        const db = getDB();
        const collection = db.collection("token");

        // Find in token in database
        const tokenExists = await collection.findOne({ token });
        
        // If no token matches, return token invalid
        if (!tokenExists) {
            console.log("Token invalid");
            return res.status(401).send("Token invalid");
        }

        // If there is a match, continue with below code
        next();

    } catch (err) {
        // return error
        console.error("Error:", err);
        return res.status(401).send("Unauthorized");
    }
};

export default jwtAuth;
