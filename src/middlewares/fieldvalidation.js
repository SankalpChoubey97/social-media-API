import { getDB } from "../config/mongodb.js";

export const validate = async (req, res, next) => {
    const { name, email, password, age} = req.body;
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(age);
    //mandatory fiels validation
    if (!name) {
        return res.status(401).send("Name field required");
    }

    if (!email) {
        return res.status(401).send("Email field required");
    }

    if (!password) {
        return res.status(401).send("Password field required");
    }

    if (!(age === undefined || typeof age === 'number')) {
        return res.status(401).send("Age should be a number");
    }

    //check for unique email id
    try {
        const db = getDB();
        const collection = db.collection("users");
        const mail = await collection.findOne({ email });
        if (mail) {
            return res.status(401).send("This email has already been used to create an account");
        }
    } catch (error) {
        console.error("Error while checking email uniqueness:", error);
        return res.status(500).send("Internal Server Error");
    }

    // Test the email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(401).send("Please provide a valid email address");
    }

    // Test the password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&!@#^(){}[\]:;<>,.?/~_+-=|\\]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(401).send("Please provide a valid password");
    }

    next();
};


