const Web3 = require('web3');
const truffle_connect = require('./connectChain.js');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const router = require('express').Router();
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


	router.get('/getAccounts',auth,(req, res) => {
	  console.log("**** GET /getAccounts ****");
	  truffle_connect.start(function (answer) {
	    res.send(answer);
	  })
	});

	router.post('/setUserName',auth,(req, res) => {
	  console.log("**** POST /setUserName ****");
	  console.log(req.body);

	  let userName = req.body.userName;
	  truffle_connect.setUserName(userName, (response) => {
	    res.send(response);
	  });
	});

	router.post('/setAccount',auth,(req, res) => {
	  console.log("**** POST /setAccount ****");
	  console.log(req.body);

	  let sender = req.body.sender;
	  truffle_connect.setAccount(sender, (response) => {
	    res.send(response);
	  });
	});

	router.get('/getBallotCount',auth,(req, res) => {
	  console.log("**** GET / getBallotCount ****");
	  truffle_connect.getBallotCount(function (answer) {
	    res.send(answer);
	  })
	});

	router.post('/ballot_i',auth,(req, res) => {
	  console.log("**** POST /ballot_i ****");
	  let id = req.body.id;

	  truffle_connect.ballot_i(id, (response) => {
	    res.send(response);
	  });
	});

	router.post('/setBallot',auth, (req, res) => {
	  console.log("**** post /setBallot ****");
	  console.log("data to post: ", req.body);
	  let name = req.body.name;
	  let startTime = req.body.startTime;
	  let endTime = req.body.endTime;
	  let canString = req.body.canString;

	  truffle_connect.setBallot(name, startTime, endTime, canString, (response) => {
		console.log(response);
	    res.send(response);
	  });
	});

	router.post('/setBallotID',auth, (req, res) => {
	  console.log("**** POST /setBallotID ****");
	  console.log(req.body);

	  let id = req.body.id;
	  truffle_connect.setBallotID(id, (response) => {
	    res.send(response);
	  });
	});

	router.get('/viewCandidates',auth, (req, res) => {
	  console.log("**** GET / viewCandidates ****");
	  truffle_connect.viewCandidates(function (answer) {
	    res.send(answer);
	  })
	});

	router.post('/candidate_i',auth,(req, res) => {
	  console.log("**** POST /candidate_i ****");
	  let id = req.body.id; 

	  truffle_connect.candidate_i(id, (response) => {
	    res.send(response);
	  });
	});

	router.get('/votedORnot',auth,(req, res) => {
	  console.log("**** GET / votedORnot ****");
	  truffle_connect.votedORnot(function (answer) {
	    res.send(answer);
	  })
	});

	router.post('/vote',auth,(req, res) => {
	  console.log("**** POST /vote ****");
	  let id = req.body.id; 

	  truffle_connect.vote(id, (response) => {
	    res.send(response);
	  });
	});

module.exports = router;