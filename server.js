console.log("Server");
require('dotenv').config();
let http = require('http');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
       user: process.env.EMAIL_ID,
       pass: process.env.EMAIL_PASS
    }
});

//Database Connection
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


//authentication
const authentication = require('./routes/authentication.js');
app.use(authentication);


// ballot sql modules imported and used
const ballotquery = require('./routes/ballotquery.js');
app.use(ballotquery);




//provide html pages
const pages = require('./routes/page.js');
app.use(pages);


const port = 4000 || process.env.PORT;

/************ block chain *************/
const Web3 = require('web3');
const truffle_connect = require('./routes/connectChain.js');
const connectServer = require('./routes/connectServer.js');
//require('./routes/connectServer.js')(app);
app.use(connectServer);
/************ block chain *************/
/*
app.listen(port, () => {
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  console.log("Express Listening at http://localhost:" + port);
});
*/





// Handling 404
// This should reamin at the bottom of the file 
app.use(function(req,res){
    res.status(404);
    res.sendFile('./views/html/404.html',{root: __dirname});
})

let server = http.createServer(app);
server.listen(port,() => {
    truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
    console.log("Express Listening at http://localhost:" + port);
});