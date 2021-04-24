const mysql = require('mysql');
const express = require('express');
const router = require('express').Router();
const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'proj_db'
});

router.use(express.json({limit: '1mb'}));

router.post('/user/ongoing',(req,res)=>{
    console.log(req.body.username);
    let ballots = [];
//do sql query and just console.log the output or just send the query object in res.send()
    ballots.push({bid: "#3232", bname: "vote 1",startTime: "12-32-34",endTime:"2323"});
    ballots.push({bid: "#3323", bname: "vote 2",startTime: "12-32-34",endTime:"2323"});
    res.setHeader('Content-Type', 'application/json');
    res.json({ballots: ballots});
    return;
})


router.post('/user/finished',(req,res)=>{

    //do sql query and just console.log the output or just send the query object in res.send()

    res.send("Hello World");
})


router.post('/user/upcoming',(req,res)=>{

//do sql query and just console.log the output or just send the query object in res.send()

    res.send("Hello World");
})





router.post('/invites/ongoing',(req,res)=>{
    
    const username = request.body.username;
//do sql query and just console.log the output or just send the query object in res.send()

    res.send("Hello World");
})


router.post('/invites/finished',(req,res)=>{
    
//do sql query and just console.log the output or just send the query object in res.send()
    
    res.send("Hello World");
})

router.post('/invites/upcoming',(req,res)=>{
    
//do sql query and just console.log the output or just send the query object in res.send()


    res.send("Hello World");
})

module.exports = router;