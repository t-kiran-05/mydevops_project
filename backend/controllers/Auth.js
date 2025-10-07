const User = require("../models/User");
const bcrypt=require('bcryptjs');
const { sendMail } = require("../utils/Emails");
const { sanitizeUser } = require("../utils/SanitizeUser");
const { generateToken } = require("../utils/GenerateToken");

exports.signup=async(req,res)=>{
    try {
        const existingUser=await User.findOne({email:req.body.email})
        
        // if user already exists
        if(existingUser){
            return res.status(400).json({"message":"User already exists"})
        }

        // hashing the password
        const hashedPassword=await bcrypt.hash(req.body.password,10)
        req.body.password=hashedPassword
        req.body.isVerified=true

        // creating new user
        const createdUser=new User(req.body)
        await createdUser.save()

        // getting secure user info
        const secureInfo=sanitizeUser(createdUser)

        // generating jwt token
        const token=generateToken(secureInfo)

        // sending jwt token in the response cookies
        res.cookie('token',token,{
            sameSite:process.env.PRODUCTION==='true'?"None":'Lax',
            maxAge:new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000))),
            httpOnly:true,
            secure:process.env.PRODUCTION==='true'?true:false
        })

        res.status(201).json(sanitizeUser(createdUser))

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error occured during signup, please try again later"})
    }
}

exports.login=async(req,res)=>{
    try {
        // checking if user exists or not
        const existingUser=await User.findOne({email:req.body.email})

        // if exists and password matches the hash
        if(existingUser && (await bcrypt.compare(req.body.password,existingUser.password))){

            // getting secure user info
            const secureInfo=sanitizeUser(existingUser)

            // generating jwt token
            const token=generateToken(secureInfo)

            // sending jwt token in the response cookies
            res.cookie('token',token,{
                sameSite:process.env.PRODUCTION==='true'?"None":'Lax',
                maxAge:new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000))),
                httpOnly:true,
                secure:process.env.PRODUCTION==='true'?true:false
            })
            return res.status(200).json(sanitizeUser(existingUser))
        }

        res.clearCookie('token');
        return res.status(404).json({message:"Invalid Credentails"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Some error occured while logging in, please try again later'})
    }
}







exports.logout=async(req,res)=>{
    try {
        res.cookie('token',{
            maxAge:0,
            sameSite:process.env.PRODUCTION==='true'?"None":'Lax',
            httpOnly:true,
            secure:process.env.PRODUCTION==='true'?true:false
        })
        res.status(200).json({message:'Logout successful'})
    } catch (error) {
        console.log(error);
    }
}

exports.checkAuth=async(req,res)=>{
    try {
        if(req.user){
            const user=await User.findById(req.user._id)
            return res.status(200).json(sanitizeUser(user))
        }
        res.sendStatus(401)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}