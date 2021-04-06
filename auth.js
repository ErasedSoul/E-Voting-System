console.log("Auth Server..");
require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
       user: process.env.EMAIL_ID,
       pass: process.env.EMAIL_PASS
    }
});
app.use(express.json());

let listOfUser = new Map();
listOfUser.set('hana','bana');
let otp = new Map();

let refreshTokens = [];

//create new token using refresh token
app.post('/token',(req,res) => {

    const refreshToken = req.body.token

    if(refreshToken == null) return res.sendStatus(401);

    if(refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{

        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken({name:user.name});
        res.json({accessToken: accessToken});
    })
})


//authentication of user
app.post('/login',(req,res) =>{

    //Authenticate users
    const username = req.body.username;
    const password = req.body.password;
    if(!listOfUser.get(username))
    {
        return res.status(403).send({message:'Username is not valid!'});
    }
    if(listOfUser.get(username) !== password)
    {
        return res.status(403).send({message:'Wrong Credencials!'});
    }

    //Create new tokens on login
    const user = {name: username};  
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
    res.json({accessToken: accessToken, refreshToken: refreshToken,message : 'login successful'});
})

app.post('/signup',(req,res) =>{

    const username = req.body.username;
    const password = req.body.password;
    const emailId = req.body.emailId;
    
    if(sendOtp(emailId) == false){
        res.status(400).send({message:'OTP not send'});
    }
    else{
        res.status(200).send({message:'OTP send successfully'});
    }
    
})

app.post('/checkotp',(req,res)=>{

    const username = req.body.username;
    const password = 'password'; // actually get it from db
    const emailId = req.body.emailId;
    const otp = req.body.otp;

    const serverOtp = 123;//get from db

    if(otp == serverOtp)
    {
        // store username & password in original db
        res.status(200).send({message: "Account created & verified"});
    }
    else{
        res.status(403).send({message: "Wrong OTP"}); 
    }

})


function sendOtp(emailId)
{
    const otp = generateOTP();
    let otpMail ={
        from: process.env.EMAIL_ID,
        to: emailId,
        subject: 'OTP for Email Verification',
        html: `<h1>${otp}</h1>`
    };
    let check = 
    transporter.sendMail(otpMail,(err,info)=>{

        if(error){
            return false;
        }
        else{
            return true;
        }
    });
    return check;
}
function generateOTP() {
          
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '10min'})
}


/*
Token Authentication
function authenticateToken(req,res,next){
   const authHeader = req.headers['authorization']
   const token = authHeader && authHeader.split(' ')[1];

   if(token == null ) return res.sendStatus(401);

   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{

        if(err) return res.sendStatus(403);

        req.user = user;
        next();
   })
}
*/

app.listen(4000);