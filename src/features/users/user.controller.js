import { getDB } from "../../config/mongodb.js";
import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

export default class UserController{
    constructor(){
        this.userRepository=new UserRepository();
    }

    async signUp(req,res,next){
        try{
            const {name,email,password,age,gender}=req.body;
            //hashing password
            const hashedPassword=await bcrypt.hash(password,12);
            let user;
            //if statements for if image was passed in body or not 
            if(req.file){
                user=new UserModel(name,email,hashedPassword,age,gender,req.file.filename);
            }
            else{
                user=new UserModel(name,email,hashedPassword,age,gender);
            }
            await this.userRepository.signUp(user);
            res.status(201).send(user);
        }catch(err){
            console.log("Inside signup Error");
            next(err);
        }
    }

    async signIn(req, res, next) {
        console.log("Inside signin controller");
        try {
          const { email, password } = req.body;
          //find user by email
          const user = await this.userRepository.findByEmail(email);

          if (!user) {
            return res.status(400).send("Incorrect credentials");
          } else {
            //compare encrypted password
            const result = await bcrypt.compare(password, user.password);
            if (result) {
              //create token
              const token = jwt.sign(
                { userID: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
              );
              
              // Add token to the database
              await this.userRepository.addToken(token,user._id);

            //remove this token from data base after 1 hour
                    setTimeout(async () => {
                    await getDB().collection('token').deleteOne({token});
                    console.log("Token removed from database after 1 hour");
                    }, 60 * 60 * 1000); 
      
              // Send token in response

              return res.status(200).send(token);
            } else {
              return res.status(400).send("Incorrect Credentials");
            }
          }
        } catch (err) {
          console.log("Inside controller error", err);
          next(err);
        }
      }
      

    async signOut(req, res) {
        // Read the token from the request headers
        const token = req.headers["authorization"];
        console.log("Inside signout controller");
        const userID=req.userID;
    
        try {
            //check the token in database with the userID
            const deletedToken=await this.userRepository.signOut(token,userID);
            return res.status(deletedToken.code).send(deletedToken.message);
        } catch (err) {
            console.log(err);
            // Return error if token is invalid
            return res.status(401).send("Unauthorized");
        }
    }
    
    async signOutAll(req,res){
        try{
            const userID=req.userID;
            const deletedToken=await this.userRepository.signOutAll(userID);
            if(deletedToken){
                return res.status(200).send("Signed out from all devices");
            }
            else{
                return res.status(400).send("invalid token");
            }
        }catch(err){
            console.log(err);
            return res.status(401).send("Unauthorized");
        }
        
    }

    async getDetails(req,res,next){
        try{
            const userID=req.params.userID;
            const result=await this.userRepository.findById(userID);
            if(result){
                return res.status(200).send(result);
            }else{
                return res.status(400).send("No details you this userID");
            }
        }catch(err){
            console.log("Inside get details error");
            next(err);
        }
    }

    async getAllDetails(req,res){
        try{
            const result=await this.userRepository.getAll();
            return res.status(200).send(result);
        }catch(err){
            console.log("Inside get All Details error");
            next(err);
        }
    }

    async updateDetails(req, res, next) {
        try {
            const userID = req.userID;
            const { name, age, gender } = req.body;
            let avatar = null;
            //adding avatar according to if file is uploaded or not
            if (req.file) {
                console.log("image" + req.file.filename);
                avatar = req.file.filename;
            }
            await this.userRepository.updateDetails(userID, name, age, gender, avatar);
            return res.status(200).send("Details updated");
        } catch (err) {
            console.log("Inside update user details controller error", err);
            next(err); // Pass error to the error handling middleware
        }
    }
    
}