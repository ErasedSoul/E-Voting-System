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
    const username = req.body.username;
    //let ballots = [];
    
    //do sql query and just console.log the output or just send the query object in res.send()

    let sqlball = "SELECT * FROM ballots WHERE `userid` = ? AND `startdate`<=CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP<`enddate` ";
    db.query(sqlball, [username], (err, result)=>{
        if(err)
        {
            throw err;
        }
        else {
            res.send(result);
            //console.log("Ballot details inserted in ballots!"+result[0].ballotid);
        }
    });

    /*ballots.push({bid: "#3232", bname: "vote 1",startTime: "12-32-34",endTime:"2323"});
    ballots.push({bid: "#3323", bname: "vote 2",startTime: "12-32-34",endTime:"2323"});
    res.setHeader('Content-Type', 'application/json');
    res.json({ballots: ballots});*/
    
    return;
})


router.post('/user/finished',auth,(req,res)=>{

    //do sql query and just console.log the output or just send the query object in res.send()

    const username = req.body.username;
    //let ballots = [];

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

    const username = req.body.username;
    //let ballots = [];
    
    //do sql query and just console.log the output or just send the query object in res.send()

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





router.post('/invites/ongoing',auth,(req,res)=>{
    
    const username = request.body.username;
//do sql query and just console.log the output or just send the query object in res.send()

    res.send("Hello World");
})


router.post('/invites/finished',auth,(req,res)=>{
    
//do sql query and just console.log the output or just send the query object in res.send()
    
    res.send("Hello World");
})

router.post('/invites/upcoming',auth,(req,res)=>{
    
//do sql query and just console.log the output or just send the query object in res.send()


    res.send("Hello World");
})

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


module.exports = router;