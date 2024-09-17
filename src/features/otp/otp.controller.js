import OTPRepository from "./otp.repository.js";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';

export default class OTPController{
    constructor(){
        this.otprepository=new OTPRepository();
    }

    //complete this function later
    async generateOTP(req,res,next){
        try{
            const {email}=req.body;
            const otp=await this.otprepository.getOTP(email);
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'codingninjas2k16@gmail.com',
                    pass: 'slwvvlczduktvhdj'
                }
            });
            
            // Setup email data
            let mailOptions = {
                from: 'codingninjas2k16@gmail.com',
                to: email,
                subject: 'OTP',
                text: 'Your OTP for password change is '+otp+'. This is valid only for next 15 mins'
            };
            
            // Send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(400).send("Error while sending mail");
                }
                return res.status(200).send("The otp is sent to your email id");
            });
        }catch(err){
            console.log("Inside generate OTP error controller");
            next(err);
        }
    }

    async validateOTP(req,res,next){
        try{
            const {email,otp}=req.body;
            console.log("Inside verify otp controller");
            const result=await this.otprepository.validateOTP(email,otp);
            return res.status(result.code).send(result.message);
        }catch(err){
            console.log("Inside validate OTP error controller");
            next(err);
        }
    }

    async resetPassword(req,res,next){
        try{
            const {email,password}=req.body;
            const hashedPassword=await bcrypt.hash(password,12);
            const result=await this.otprepository.resetPassword(email,hashedPassword);
            return res.status(result.code).send(result.message);
        }catch(err){
            console.log("Inside reset password error controller");
            next(err);
        }
    }
}