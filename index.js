const listenPort = 3000;
/* Requires */
let express = require("express");  //loads the express into the application
let path = require("path");
const { Recoverable } = require("repl");
/* we do things through and by the instance of Express */
let app = express(); // object of type express
// post express 4.16, use
app.use(express.urlencoded({extended: true}));
// converts ejs format pages into html pages prior to returning them to browser
app.set("view engine","ejs");
/* initialize the web server on specified port */
app.listen(listenPort,function() {
    console.log("Listener active on port " + listenPort);
});
/*  set up the database connection via knex */
/*  requires installation of sqlite3 and knex  */
let knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./music.db"
    },
    useNullAsDefault: true
});
/********************** Routes ************************** */
app.get("/",function(req, res) {
    knex.from("Songs").select("*").orderBy("songTitle","songArtist","songGenre","songLength")
    .then(songs => {
        console.log(songs);
        res.render("index",{songList: songs});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
});

//login
app.get('/login', function(req,res) {
    res.render('login');
});
//still needs to be done 
app.post('/login',function(req, res) {
    knex.from("Users").select("*")
    .then(users => {
        console.log(users);
        localStorage.setItem = users;
        if (localStorage.getItem(users) != null ) { //doesnt work
        res.render("index",{Key: users}); 
        }
        //res.redirect("/index");
       else {
        //if there is no row returned render login.ejs
        res.redirect("/login");
        }
    })     
});
   
//logout
app.post('/logout',function(req,res) {
    localStorage.clear();
    //how to clear localStorage?
    res.redirect("/login");
});

//addsong
//still needs to be done
app.get('/addSong', function(req,res) {
   //  check to see if user is logged in, res.redirect login page
    res.render('addSong');
});
app.post('/addSong',function(req, res) {
    //if (localStorage != null) {
    knex('Songs').insert({
        songTitle: req.body.songTitle,
        songArtist: req.body.songArtist, songGenre: req.body.songGenre, 
        songLength: req.body.songLength})
        .then(results => {
            res.redirect("/");
    })
    //}
    //else {
        //res.redirect("login");
    //}
});
//editsong
//still needs to be done
app.get('/editSong/:id',function(req, res) {
    //if user is not logged in login page
    knex("Songs").where('id',req.params.id)
        .then(results => {
            res.render("editsong",{song: results});
        }).catch(err => {
            console.log(err);
            res.status(500).json({err});
        });
});
app.post('/editSong',function(req, res) {
    knex('Songs').where({id: req.body.id}).update({
        id: req.body.id, songTitle: req.body.songTitle,
        songArtist: req.body.songArtist, songGenre: req.body.songGenre,
        songLength: req.body.songLength
    })
        .then(results => {
            res.redirect("/");
        })
    });
//deletesong
app.post("/deleteSong/:id",function(req, res) {
    knex("Songs").where("id",req.params.id).del()
        .then(songs => {
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({err});
        })
});
//song mix get and post
app.get('/songMix', function(req,res) {
    //  check to see if user is logged in, res.redirect login page
     res.render('songMix');
});
app.post('/songMix',function(req, res) {
    knex('Songs').where({id: req.body.id}).update({
        id: req.body.id, songTitle: req.body.songTitle,
        songArtist: req.body.songArtist, songGenre: req.body.songGenre,
        songLength: req.body.songLength
    })
        .then(results => {
            res.redirect("/");
        })
    });
//still needs to be done
//if the user is not logged in go to login.ejs
