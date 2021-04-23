const mysql = require('mysql');
const router = require('express').Router();
const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'proj_db'
});

router.get('/user/ongoing',(req,res)=>{
    
//do sql query and just console.log the output or just send the query object in res.send()

    res.send("Hello World");
})


router.get('/user/finished',(req,res)=>{

    //do sql query and just console.log the output or just send the query object in res.send()

    res.send("Hello World");
})


router.get('/user/upcoming',(req,res)=>{

//do sql query and just console.log the output or just send the query object in res.send()

    res.send("Hello World");
})





router.get('/invites/ongoing',(req,res)=>{
    
    const username = request.body.username;
//do sql query and just console.log the output or just send the query object in res.send()

    res.send("Hello World");
})


router.get('/invites/finished',(req,res)=>{
    
//do sql query and just console.log the output or just send the query object in res.send()
    
    res.send("Hello World");
})

router.get('/invites/upcoming',(req,res)=>{
    
//do sql query and just console.log the output or just send the query object in res.send()


    res.send("Hello World");
})

module.exports = router;