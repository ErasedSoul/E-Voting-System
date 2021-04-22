const Web3 = require('web3');
const truffle_connect = require('./connectChain.js');


module.exports = function(app){

	app.get('/getAccounts', (req, res) => {
	  console.log("**** GET /getAccounts ****");
	  truffle_connect.start(function (answer) {
	    res.send(answer);
	  })
	});

	app.post('/setUserName', (req, res) => {
	  console.log("**** POST /setUserName ****");
	  console.log(req.body);

	  let userName = req.body.userName;
	  truffle_connect.setUserName(userName, (response) => {
	    res.send(response);
	  });
	});

	app.post('/setAccount', (req, res) => {
	  console.log("**** POST /setAccount ****");
	  console.log(req.body);

	  let sender = req.body.sender;
	  truffle_connect.setAccount(sender, (response) => {
	    res.send(response);
	  });
	});

	app.get('/getBallotCount', (req, res) => {
	  console.log("**** GET / getBallotCount ****");
	  truffle_connect.getBallotCount(function (answer) {
	    res.send(answer);
	  })
	});

	app.post('/ballot_i', (req, res) => {
	  console.log("**** POST /ballot_i ****");
	  let id = req.body.id;

	  truffle_connect.ballot_i(id, (response) => {
	    res.send(response);
	  });
	});

	app.post('/setBallot', (req, res) => {
	  console.log("**** post /setBallot ****");
	  console.log("data to post: ", req.body);
	  
	  let name = req.body.name;
	  let startTime = req.body.startTime;
	  let endTime = req.body.endTime;
	  let canString = req.body.canString;

	  truffle_connect.setBallot(name, startTime, endTime, canString, (response) => {
	    res.send(response);
	  });
	});

	app.post('/setBallotID', (req, res) => {
	  console.log("**** POST /setBallotID ****");
	  console.log(req.body);

	  let id = req.body.id;
	  truffle_connect.setBallotID(id, (response) => {
	    res.send(response);
	  });
	});

	app.get('/viewCandidates', (req, res) => {
	  console.log("**** GET / viewCandidates ****");
	  truffle_connect.viewCandidates(function (answer) {
	    res.send(answer);
	  })
	});

	app.post('/candidate_i', (req, res) => {
	  console.log("**** POST /candidate_i ****");
	  let id = req.body.id; 

	  truffle_connect.candidate_i(id, (response) => {
	    res.send(response);
	  });
	});

	app.get('/votedORnot', (req, res) => {
	  console.log("**** GET / votedORnot ****");
	  truffle_connect.votedORnot(function (answer) {
	    res.send(answer);
	  })
	});

	app.post('/vote', (req, res) => {
	  console.log("**** POST /vote ****");
	  let id = req.body.id; 

	  truffle_connect.vote(id, (response) => {
	    res.send(response);
	  });
	});

}