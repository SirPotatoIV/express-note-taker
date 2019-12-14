// Create a server using Express.JS
// Dependencies
// =============================================================
const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();

// Set the port. process.env.PORT is for heroku, 3000 is for local testing purposes
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ONLY BEING ADDED FOR LOCAL TESTING PURPOSES!!!!---------------------
// 3000 is what I set the default port value to
// used this for inspiration https://gist.github.com/ryanflorence/701407
if(PORT === 3000){
    // code doesn't work locally because looking for LOCALHOST:3000/assets/, which doesn't exist.
    // the index.html and note.html rely on the index.js and style.css files.
    // * GET is handling anything that starts with /assets. 
    // req.url is added onto the directory name.
    app.get("/assets/*", function(req, res) {
        res.sendFile(path.join(__dirname, `/public/${req.url}`))
        // console.log("annoying issue occurred")
        // console.log(req.url);
    });
// * Create a set of routes for displaying the HTML pages
// =========================================
    app.get("/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "public/notes.html"));
    });
    // * GET `*` - Should return the `index.html` file
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "public/index.html"));
    });
}else{
    // This is how it will work when not running locally
    // * Create a set of routes for displaying the HTML pages
    // =========================================
    // * GET `/notes` - Should return the `notes.html` file.
    app.get("/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "public/notes"));
    });
    // * GET `*` - Should return the `index.html` file
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "public/index"));
    });
}
// --------------------------------------------------------------------


// Create New Reservation - takes in JSON input
//   * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res) {
    fs.readFile('db/db.json', 'utf8', function(err, data){
        if(err){
            console.log(err)
            return
        }
        // sends data in db to site. readFile already turns db data into a string, so no need for req.json
        res.send(data);
    });
    // console.log(testArray)
});
// * The following API routes should be created:


//   * POST `/api/notes` - Should recieve a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.

//   * DELETE `/api/notes/:id` - Should recieve a query paramter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.




// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});