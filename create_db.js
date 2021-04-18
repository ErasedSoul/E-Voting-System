const express = require('express');
const mysql = require('mysql');

//Create Connection
const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: ''
});
const db2 = mysql.createConnection({
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

const app = express();

//create a DB
app.get('/createdb', (req,res)=>{
    let sql = 'CREATE DATABASE proj_db';
    db.query(sql, (err, result)=>{
        if(err)
            throw err;
        else console.log("DB Created "+result);
        res.send({message: "DataBase Created"});
    });
});

//create tables
app.get('/fortables', (req,res) => {
    let q1 = 'CREATE TABLE voters (userid VARCHAR(50) PRIMARY KEY, emailid VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL)';
    db2.query(q1, (err,res) => {
        if(err) throw err;
        else console.log("voters table created!");
    });

    let q2 = 'CREATE TABLE ballots (bname VARCHAR(50) PRIMARY KEY, startdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, enddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP)';
    db2.query(q2, (err,res) => {
        if(err) throw err;
        else console.log("ballots table created!");
    });

    let q3 = 'CREATE TABLE `voter-ballot` (`userid` VARCHAR(50) NOT NULL, `bname` VARCHAR(50) NOT NULL)';
    db2.query(q3, (err,res) => {
        if(err) throw err;
        else console.log("voter-ballot table created!");
    });

    let q9 = 'ALTER TABLE `voter-ballot` ADD CONSTRAINT `fk_name` FOREIGN KEY (`userid`) REFERENCES `voters`(`userid`) ON DELETE CASCADE ON UPDATE CASCADE';
    db2.query(q9, (err,res) => {
        if(err) throw err;
        else console.log("Foreign Key Updated!");
    });

    //ALTER TABLE `voter-ballot` ADD CONSTRAINT `fk_name` FOREIGN KEY (`userid`) REFERENCES `voters`(`userid`) ON DELETE CASCADE ON UPDATE CASCADE;
    let q7 = 'ALTER TABLE `voter-ballot` ADD CONSTRAINT `fk_bname` FOREIGN KEY (`bname`) REFERENCES `ballots`(`bname`) ON DELETE CASCADE ON UPDATE CASCADE';
    db2.query(q7, (err,res) => {
        if(err) throw err;
        else console.log("Foreign Key Updated!");
    });

    let q4 = 'CREATE TABLE notifs (userid1 VARCHAR(50) NOT NULL, userid2 VARCHAR(50) NOT NULL, bname VARCHAR(50) NOT NULL, content VARCHAR(100) NOT NULL)';
    db2.query(q4, (err,res) => {
        if(err) throw err;
        else console.log("notifs table created!");
    });

    let q5 = 'ALTER TABLE `notifs` ADD CONSTRAINT `fk_uname1` FOREIGN KEY (`userid1`) REFERENCES `voters`(`userid`) ON DELETE CASCADE ON UPDATE CASCADE';
    db2.query(q5, (err,res) => {
        if(err) throw err;
        else console.log("Foreign Key Updated!");
    });

    let q6 = 'ALTER TABLE `notifs` ADD CONSTRAINT `fk_uname2` FOREIGN KEY (`userid2`) REFERENCES `voters`(`userid`) ON DELETE CASCADE ON UPDATE CASCADE';
    db2.query(q6, (err,res) => {
        if(err) throw err;
        else console.log("Foreign Key Updated!");
    });

    let q8 = 'ALTER TABLE `notifs` ADD CONSTRAINT `fk_ballname` FOREIGN KEY (`bname`) REFERENCES `ballots`(`bname`) ON DELETE CASCADE ON UPDATE CASCADE';
    db2.query(q8, (err,res) => {
        if(err) throw err;
        else console.log("Foreign Key Updated!");
    });

    //username password emailid Otp
    let q10 = 'CREATE TABLE temp (userid VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL, emailid VARCHAR(50) NOT NULL, otp INT NOT NULL)';
    db2.query(q10, (err,res) => {
        if(err) throw err;
        else {           
        console.log("temp table created!");
        console.log("Finished");
    }
    });
    res.send({message: "Tables Created"});
})

app.listen('3000', ()=>{
    console.log("Server Started!");
});