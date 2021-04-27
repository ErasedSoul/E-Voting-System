require('dotenv').config();
const express = require('express');
const router = require('express').Router();
const path = require('path');
router.use(express.json());
const jwt = require('jsonwebtoken');
router.use(express.static(path.join(__dirname, '../views')));
const cookieParser = require('cookie-parser');
router.use(cookieParser());

function auth(req,res,next){
    if(req.cookies == null)
    return res.sendStatus(401);
    const token = req.cookies.accessToken;
    if(token == null ) return res.sendStatus(401);
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
         if(err) return res.sendStatus(401);
         next();
    })
}

/////////////////Routing///////////////////////////////////////////////////////////

router.get('/',(req,res) => {
    
    res.sendFile('./views/html/index.html',{ root: path.join(__dirname, '../')});
});
router.get('/dashboard',auth,(req,res) => {
    
    res.sendFile('./views/html/dashboard.html',{ root: path.join(__dirname, '../')});
});
router.get('/home',auth,(req,res) => {
    
    res.sendFile('./views/html/dashboard.html',{ root: path.join(__dirname, '../')});
});
router.get('/profile',auth,(req,res) => {
    
    res.sendFile('./views/html/profile.html',{ root: path.join(__dirname, '../')});
});
router.get('/about',auth,(req,res) => {
    
    res.sendFile('./views/html/about.html',{ root: path.join(__dirname, '../')});
});

// shrabana 
router.get('/createBallot',auth,(req,res) => {    
    res.sendFile('./views/html/createBallot.html',{ root: path.join(__dirname, '../')});
});
router.get('/ballotCreated',auth,(req,res) => {
    res.sendFile('./views/html/ballotCreated.html',{ root: path.join(__dirname, '../')});
});
router.get('/castVote',auth,(req,res) => {
    res.sendFile('./views/html/castVote.html',{ root: path.join(__dirname, '../')});
});
router.get('/user/ongoing',auth,(req,res) => {
    
    res.sendFile('./views/html/ballotUserOngoing.html',{ root: path.join(__dirname, '../')});
});

//dashboard links
router.get('/user/finished',auth,(req,res) => {
    
    res.sendFile('./views/html/ballotUserFinished.html',{ root: path.join(__dirname, '../')});
});
router.get('/user/upcoming',auth,(req,res) => {
    
    res.sendFile('./views/html/ballotUserUpcoming.html',{ root: path.join(__dirname, '../')});
});

router.get('/invite/ongoing',auth,(req,res) => {
    
    res.sendFile('./views/html/ballotInviteOngoing.html',{ root: path.join(__dirname, '../')});
});
router.get('/invite/finished',auth,(req,res) => {
    
    res.sendFile('./views/html/ballotInviteFinished.html',{ root: path.join(__dirname, '../')});
});
router.get('/invite/upcoming',auth,(req,res) => {
    
    res.sendFile('./views/html/ballotInviteUpcoming.html',{ root: path.join(__dirname, '../')});
});

module.exports = router;