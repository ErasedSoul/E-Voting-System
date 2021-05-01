const contract = require('truffle-contract');
const election_artifact = require('../build/contracts/Election.json');
var Election = contract(election_artifact);
var accounts = []; 
var account; 
var userName = ""; 
var ballotID; 

module.exports = {
  // connects with browser and gives a list of accounts 
  start: function(callback) {
    var self = this;

    // Bootstrap the Election abstraction for Use.
    Election.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        console.log("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      accounts = accs;
      account = accs[0];
      callback(self.accounts);
    });
  },

  setUserName: (name, callback)=>{
    var self = this;
    userName = name;
    console.log("userName is: ", name ); 
    callback("Done!!"); 
  }, 

  setAccount: (acc, callback)=>{
    var self = this;
    account = acc;
    console.log("account is: ", account ); 
    callback("Done!!"); 
  }, 

  getBallotCount : (callback)=> {
    var self = this;
    Election.deployed().then(function(instance) {
      return instance.ballotCount();
    }).then( (ballotCount) => {
      callback({account, ballotCount});
    }).catch((error)=> {
      console.log(error);
      callback("ERROR 404");
    });
  }, 
  
  ballot_i : (id, callback)=> {
    var self = this;
    Election.deployed().then(function(instance) {
        return instance.ballots(id);
    }).then( (ballot) => {
          var id = parseInt(ballot[0]);
          var name = ballot[1];
          var startTime = ballot[2];
          var endTime = ballot[3];
          var canCount = parseInt(ballot[4]);
          callback({id, name, startTime, endTime, canCount});
    }).catch((error)=> {
      console.log(error);
      callback("ERROR 404");
    });
  }, 

    currentBallot : (callback)=> {
    var self = this;
    Election.deployed().then(function(instance) {
        return instance.ballots(ballotID);
    }).then( (ballot) => {
          var id = parseInt(ballot[0]);
          var name = ballot[1];
          var startTime = ballot[2];
          var endTime = ballot[3];
          var canCount = parseInt(ballot[4]);
          callback({id, name, startTime, endTime, canCount});
    }).catch((error)=> {
      console.log(error);
      callback("ERROR 404");
    });
  }, 

  // add a new ballot
  setBallot: (name, startTime, endTime, canString, callback)=> {
    var self = this;

    Election.deployed().then( (instance)=> {
      return instance.addBallot(name, startTime, endTime,canString,{ from: account, gas:3000000 });
    }).then( (answer) => {
      callback(answer);
    }).catch((error)=> {
      console.log(error);
      callback("ERROR 404");
    });
  }, 

  setBallotID: (id, callback)=>{
    var self = this;
    ballotID = parseInt(id);
    console.log("ballot selected is: ", id ); 
    callback("Done!!"); 
  }, 

  viewCandidates : (callback)=> {
    var self = this;
    Election.deployed().then(function(instance) { 
        return instance.ballots(ballotID);
    }).then( (ballot) => {      // console.log("ballot: ", ballot);
          var id = parseInt(ballot[0]);
          var name = ballot[1];
          var startTime = ballot[2];
          var endTime = ballot[3];
          var canCount = parseInt(ballot[4]);
          callback({account, id, name, startTime, endTime, canCount});
    }).catch((error)=> {
      console.log(error);
      callback("ERROR 404");
    });
  }, 

  candidate_i : (id, callback)=> { // id refers to candidate id
    var self = this;
    Election.deployed().then(function(instance) {
        return instance.getCandidate(ballotID, id);
    }).then( (candidate) => { 
          var id = parseInt(candidate[0]);
          var name = candidate[1];
          var voteCount = parseInt(candidate[2]);
          callback({id, name, voteCount});
    }).catch((error)=> {
      console.log(error);
      callback("ERROR 404");
    });
  }, 

  votedORnot : (callback)=> { // id refers to candidate id
    var self = this;
    Election.deployed().then(function(instance) { 
        return instance.votedORnot(ballotID, userName);
    }).then( (status) => { 
          callback(status);
    }).catch((error)=> {
      console.log(error);
      callback("ERROR 404");
    });
  }, 

  vote: (id, callback)=> { // id refers to candidate id
    var self = this;
    Election.deployed().then( (instance)=> {
      return instance.vote(ballotID, id, userName, { from: account, gas:3000000 });
    }).then( (answer) => {
      callback(answer);
    }).catch((error)=> {
      console.log(error);
      callback("ERROR 404");
    });
  }, 
}
