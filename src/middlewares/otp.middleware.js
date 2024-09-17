import { getDB } from "../config/mongodb.js";

export const emailValidate = async (req, res, next) => {
    const { email } = req.body;

    const db = getDB();
    const collection = db.collection("users");

    try {
        //check if email is not blank or defined
        if(!email){
            return res.status(400).send("email field is mandatory")
        }
        const user = await collection.findOne({ email: email });
        
        // Check if email exists in the users collection
        if (!user) {
            return res.status(404).send("email not found");
        }

        next();
    } catch (error) {
        console.log("error");
        return res.status(500).send("Internal server error");
    }
};

export const passwordValidate = async (req, res, next) => {
    const {password}=req.body;

    if (!password) {
        return res.status(401).send("Password field required");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&!@#^(){}[\]:;<>,.?/~_+-=|\\]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(401).send("Please provide a valid password");
    }

    next();
}
