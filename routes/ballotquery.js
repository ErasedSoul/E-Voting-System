const mysql = require('mysql');
const express = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const path = require('path');
router.use(express.json());
const cookieParser = require('cookie-parser');
router.use(cookieParser());


const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'proj_db'
});

router.post('/user/ongoing',auth,(req,res)=>{
    const username = req.res.username.name;
    
    let sqlball = "SELECT * FROM ballots WHERE `userid` = ? AND `startdate`<=CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP<`enddate` ";
    db.query(sqlball, [username], (err, result)=>{
        if(err)
        {
            throw err;
        }
        else {
            res.send(result);
        }
    });

    return;
})


router.post('/user/finished',auth,(req,res)=>{

    const username = req.res.username.name;

    let sqlball = "SELECT * FROM ballots WHERE `userid` = ? AND CURRENT_TIMESTAMP>`enddate` ";
    db.query(sqlball, [username], (err, result)=>{
        if(err)
        {
            throw err;
        }
        else {
            res.send(result);
            console.log("Ballot details inserted in ballots!"+result);
        }
    });

    return;
})


router.post('/user/upcoming',auth,(req,res)=>{

    const username = req.res.username.name;

    let sqlball = "SELECT * FROM ballots WHERE `userid` = ? AND CURRENT_TIMESTAMP<`startdate` ";
    db.query(sqlball, [username], (err, result)=>{
        if(err)
        {
            throw err;
        }
        else {
            res.send(result);
            console.log("Ballot details inserted in ballots!"+result);
        }
    });

    
})


router.post('/invite/ongoing',auth,(req,res)=>{
    
    const username = req.res.username.name;
    
    let sqlball = "SELECT * FROM `ballots` AS b,`voter-ballot` AS vb WHERE vb.`userid`= ? AND vb.`ballotid` = b.`ballotid` AND b.`startdate`<=CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP<b.`enddate`";
    db.query(sqlball, [username], (err, result)=>{
        if(err)
        {
            throw err;
        }
        else {
            console.log(JSON.stringify(result));
            res.send(result);
        }
    });

})


router.post('/invite/finished',auth,(req,res)=>{

    const username = req.res.username.name;

    console.log("ballotquery.js ----> "+username);
    
    let sqlball = "SELECT * FROM `ballots` AS b,`voter-ballot` AS vb WHERE vb.`userid`= ? AND vb.`ballotid` = b.`ballotid` AND CURRENT_TIMESTAMP>b.`enddate` ";
    db.query(sqlball, [username], (err, result)=>{
        if(err)
        {
            throw err;
        }
        else {
            console.log(JSON.stringify(result));
            res.send(result);
        }
    });

})

router.post('/invite/upcoming',auth,(req,res)=>{

    const username = req.res.username.name;
    
    let sqlball = "SELECT * FROM `ballots` AS b,`voter-ballot` AS vb WHERE vb.`userid`= ? AND vb.`ballotid` = b.`ballotid` AND CURRENT_TIMESTAMP< b.`startdate` ";
    db.query(sqlball, [username], (err, result)=>{
        if(err)
        {
            throw err;
        }
        else {
            console.log(JSON.stringify(result));
            res.send(result);
        }
    });

})

function auth(req,res,next){
    if(req.cookies == null)
    return res.sendStatus(401);
    const token = req.cookies.accessToken;
    if(token == null ) return res.sendStatus(401);
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
         if(err) return res.sendStatus(401);
         res.username = user;
         next();
    })
}


module.exports = router;