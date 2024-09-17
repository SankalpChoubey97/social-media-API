import express from 'express';
import userRouter from './src/features/users/user.routes.js';
import { connectToMongoDB } from './src/config/mongodb.js';
import  {ApplicationError} from './src/error-handler/applicationError.js';
import postRouter from './src/features/posts/posts.routes.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import commentRouter from './src/features/comments/comment.routes.js';
import likeRouter from './src/features/likes/likes.routes.js';
import friendsRouter from './src/features/friendList/friends.routes.js';
import otpRouter from './src/features/otp/otp.routes.js';

const server=express();

server.use(express.json());

//all routes
server.use("/api/users",userRouter);
server.use("/api/otp",otpRouter);
server.use("/api/friends",jwtAuth,friendsRouter)
server.use("/api/likes",jwtAuth,likeRouter)
server.use("/api/posts",jwtAuth,postRouter);
server.use("/api/comments",jwtAuth,commentRouter);

server.get("/",(req,res)=>{
    res.send("Welcome to social media");
})

//error handler middleware
server.use((err,req,res,next)=>{

    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message);
    }
    
    console.log("Inside error handler");
    console.log(err);
    res.status(500).send("Something went wrong, please try later");
})

//Middleware to handle 404 requests
server.use((req,res)=>{
    res.status(404).send("API not found");
})

server.listen(3200,()=>{
    console.log("server is running at 3200");
    connectToMongoDB();
})