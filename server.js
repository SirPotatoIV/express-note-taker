// Create a server using Express.JS
// Dependencies
// =============================================================
const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();

// This number will be increased by one every time a new note is created.
let noteIdMaker = 0;

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
    // THIS IS ALSO BEING SENT TO WEBSITE BECAUSE /assets/* and /* WOULD BE THE SAME
    // -----
    // -----
    // -----
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "public/index.html"));
        console.log(path.join(__dirname, "public/index.html"))
    });
}else{
    // This is how it will work when not running locally
    // * Create a set of routes for displaying the HTML pages
    // =========================================
    // * GET `/notes` - Should return the `notes.html` file.
    app.get("/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "public/notes.html"));
    });
    // * GET `*` - Should return the `index.html` file
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "public/index.html"));
    });
}
// --------------------------------------------------------------------

//   * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res){
    fs.readFile('db/db.json', 'utf8', function(err, data){
        if(err){
            console.log(err)
            return
        }
        // sends data in db to site. file is already a string, so no need for req.json
        res.send(data);
    });
    // console.log(testArray)
});
//   * POST `/api/notes` - Should recieve a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
// Probably a better way to get the new note added in with like lastIndex of so I didn't need to do so much JSON, but this works.
app.post("/api/notes", function(req, res){
    const newNote = req.body;
    let updatedNotesStringified = "";
    // A new note is created so increase the note id by 1.
    noteIdMaker++;
    newNote.id = noteIdMaker;
    // If the site is starting with db.json empty it will go to the else statement.
    // If this is the site adding a new Note it will create a new note.
    if(newNote){
        console.log(`New note detected: ${newNote}`)
            // gets the data from db.json
        fs.readFile('db/db.json', 'utf8', function(err, notesStringified){
            if(err){
                console.log(`Error occurred during readfile in post notes: ${err}`)
                return
            }
            console.log(`Current Notes: ${notesStringified}`)
            // If notes already exist, this will be used to add to the current notes.
            if(notesStringified){
                const notes = JSON.parse(notesStringified)
                console.log(`A note already exists`)
                // Parses the data from db.json and stores it in notes.
                // Combines new note and current notes into a single array by spreading notes into a new array called combined notes and adding newNote.
                const combinedNotes = [...notes,newNote]
                // Stringifies combined notes so it can be stored as db.json
                updatedNotesStringified = JSON.stringify(combinedNotes);
                // Writes over previous db.json with new db.json data.
            }else{
                updatedNotesStringified = [JSON.stringify(newNote)];
            }

            fs.writeFile('db/db.json', updatedNotesStringified, function(err){
                if(err){
                    console.log(err)
                    return
                }
                
                // Homework says to send the new note back to the note.html, but currently unsure what it does with it. Possibly just used for tracking or troubleshooting purposes
                res.send(newNote);
            });
        });
}else{
    res.send("[]")
}
})

//   * DELETE `/api/notes/:id` - Should recieve a query paramter containing the id of a note to delete.
// :id stores the value in the path in the property of req.params. This is feature of express ... I think
app.delete('/api/notes/:id', function (req, res) {
    // Stores the of the note that should be deleted.
    // -- id is a string so it needs to be converted to a integer
    const noteToDeleteId = parseInt(req.params.id);
    console.log(noteToDeleteId)
    // Sends a response back to the page that the delete request was completed
    let notesStringified= "";
    
    // gets the data from db.json
    fs.readFile('db/db.json', 'utf8', function(err, notesStringified){
        if(err){
            console.log(err)
            return
        }
        // Parses the data from db.json and stores it in notes.
        const notes = JSON.parse(notesStringified);
        console.log(notes);
        // Combines new note and current notes into a single array by spreading notes into a new array called combined notes and adding newNote.
        for(let i = 0; i < notes.length; i++){
            console.log("notes.length", notes.length)
            console.log("notes i",notes[i])
            console.log("notes id", notes[i].id)
            if(notes[i].id === noteToDeleteId){
                notes.splice(i,1);
                notesStringified = JSON.stringify(notes);
                console.log("note deleted.", notesStringified)
            }
        }
        
        
        // Writes over previous db.json with new db.json data.
        fs.writeFile('db/db.json', notesStringified, function(err){
            if(err){
                    console.log(err)
                    return
                }
            });
            res.send('Got a DELETE request at /user')
    });
  })
// This means you'll need to find a way to give each note a unique `id` when it's saved. 
// In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, 
// and then rewrite the notes to the `db.json` file.


// * The following API routes should be created:







// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});