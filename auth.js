console.log("Auth Server..");
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json({limit: '1mb'}));
app.use(express.static(path.join(__dirname, 'views')));
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
       user: process.env.EMAIL_ID,
       pass: process.env.EMAIL_PASS
    }
});

////////////Database Connection ///////////////////////////////
const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'proj_db'
});
//connect
db.connect((err)=> {
    if(err)
    {
        throw err;
    }
    else console.log("MySql Connected");
});
////////////////////////////////////////////////////////////////////



////////////AUTHENTICATION///////////////////////////////////////////

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

    let sqluid = "SELECT COUNT(*) as `count` FROM `voters` WHERE `userid` = ? ";
    db.query(sqluid, [username], (err, result)=>{
        if(err)
        {
            res.sendStatus(500);
            return;
        }
        else {
            //console.log("result : "+result[0][`count`]);
            if(result[0][`count`] == 0){

                res.status(403).send({message:'Username is not valid!',check: '0'});
                return;
            }
            else{
                 
                let sqlpass = "SELECT password as `pw` FROM `voters` WHERE `userid` = ? ";
                db.query(sqlpass, [username], (err, result)=>{
                    if(err)
                    {
                        res.sendStatus(500);
                    }
                    else {
                        if(result[0][`pw`] !== password){
                            res.status(403).send({message:'Wrong Credentials!',check: '0'});
                            return;
                        }
                        else{
                            //Create new tokens on login
                            const user = {name: username};  
                            const accessToken = generateAccessToken(user);
                            const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
                            res.json({username: username,accessToken: accessToken, refreshToken: refreshToken,message : 'login successful',redirect: '/dashboard',check: '1'});
                        }
                    }
                })

            }
        }
    });
})

app.post('/signup',(req,res) =>{

    const username = req.body.username;
    const password = req.body.password;
    const emailId = req.body.emailId;
    let sqluid = "SELECT COUNT(*) as `count` FROM `voters` WHERE `userid` = ? ";
    db.query(sqluid, [username], (err, result)=>{

        if(err)
        {
            res.sendStatus(500);
            return;
        }
        else if(result[0][`count`] !== 0){

            res.json({check: '0',message: 'This username already exist'});
            return;
        }
        else
        {
            let sqlemail = "SELECT COUNT(*) as `count` FROM `voters` WHERE `emailid` = ? ";
            
            db.query(sqlemail,[emailId],(err,result) =>{

                if(err)
                res.sendStatus(500);
                else if(result[0][`count`]!== 0){
                    res.json({check: '0',message: 'This email already exist'});
                    return;
                }
                else{
                   
                    const otp = sendOtp(emailId);
                    let sqlcount = "SELECT COUNT(*) as `count` FROM `temp` WHERE `userid` = ? AND `emailid` = ?";
                    
                    db.query(sqlcount, [username, emailId], (err, result)=>{
                           
                        if(err)
                            res.sendStatus(500);
                        else 
                        {
                            console.log("result : "+result[0][`count`]);
                            if(result[0][`count`] == 0){
                                let sql = "INSERT INTO temp VALUES(?, ?, ?, ?)";
                                db.query(sql, [username, password, emailId, otp], (err, result)=>{
                                    if(err)
                                    {
                                        throw err;
                                    }
                                    else {
                                        console.log("OTP Inserted!"+result);
                                    }
                                });
                            }
                            else 
                            {
                                let sql = "UPDATE `temp` SET `otp` = ? WHERE `userid` = ? AND `emailid` = ?";
                                db.query(sql, [otp, username, emailId], (err, result)=>{
                                    if(err)
                                    {
                                        throw err;
                                    }
                                    else {
                                        console.log("OTP Updated!"+result);
                                    }
                                });
                            }
                        }
                        

                    })
                    res.status(200).send({check:'1',message:'OTP send successfully'})

                }
            })
        }
    })

})

app.post('/checkotp',(req,res)=>{

    const username = req.body.username;
    const emailId = req.body.emailId;
    const otp = req.body.otp;

    //const serverOtp;//sql - temp db otp 
    //query otp from the db 
    let sqlotp = "SELECT * FROM `temp` WHERE `userid` = ? AND `emailid` = ?";
    db.query(sqlotp, [username,emailId], (err, result)=>{
        if(err)
        {
            throw err;
        }
        else {
            const serverOtp = result[0][`otp`];
            const password = result[0][`password`];
                console.log("result : "+result);
                if(otp == serverOtp){

                    console.log("Valid User!");

                    let sql = "INSERT INTO voters VALUES(?, ?, ?)";
                    db.query(sql, [username, emailId, password], (err, result)=>{
                    if(err)
                    {
                        throw err;
                    }
                    else {
                        console.log("User inserted in Voter!"+result);
                        }
                     });

                    res.status(200).send({check: '1',message: "Account created & verified"});
                }
                else {
                    
                    console.log("Wrong OTP!");
                    res.status(403).send({check: '0',message: "Wrong OTP!"});
                     }
        }
    });

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
    transporter.sendMail(otpMail);
    return otp;
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

///////////////////////////////////////////////////////////////////////////////////



/////////////////Routing///////////////////////////////////////////////////////////



app.get('/',(req,res) => {
    
    res.sendFile('./views/html/index.html',{root: __dirname});
});
app.get('/dashboard',(req,res) => {
    
    res.sendFile('./views/html/dashboard.html',{root: __dirname});
});
app.get('/home',(req,res) => {
    
    res.sendFile('./views/html/dashboard.html',{root: __dirname});
});
app.get('/profile',(req,res) => {
    
    res.sendFile('./views/html/profile.html',{root: __dirname});
});
app.get('/about',(req,res) => {
    
    res.sendFile('./views/html/about.html',{root: __dirname});
});

/////////////////////////////////////////////////////////////////////////////////

app.listen(4000);