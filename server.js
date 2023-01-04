// connect to other files and middleware
const express = require('express');
const path = require('path');
const dbData = require('./db/db.json');
const fs = require("fs")
const uuid = require('./utils/uuid');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// get the main page
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));

// get the notes page, which is linked to the button on the main page through html
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html")));

// get notes that are already saved
app.get("/api/notes", (req, res) => res.json(dbData));

// post the user input as a new note
app.post("/api/notes", (req, res) => {

    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // new note consists of the title, text, and id
    const newNote = { title: req.body.title, text: req.body.text, id: uuid() }

    // add the new note into the database
    dbData.push(newNote);

    // write file to update the notes in the json file to include the new note along with the previous ones
    fs.writeFile('./db/db.json', JSON.stringify(dbData, null, '\t'), (err) =>
        err ? console.log(err) : console.log('Successfully updated database!')
    );

    // respond with the info in the database
    res.json(dbData);
})

// get the main page for any other endpoint not specified before this
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
})

// delete the note chosen by the user. the button is connected through html, but deleted according to the idea through the back end
app.delete("/api/notes/:id", (req, res) => {

    // Log that a DELETE request was received
    console.info(`${req.method} request received to delete a note`);

    // loop through each id and remove the one that matches the chosen id
    for (let i = 0; i < dbData.length; i++) {
        if (dbData[i].id == req.params.id) {
            dbData.splice(i, 1)
        }
    }

    // write file to update the notes in json file after deleting the chosen note
    fs.writeFile('./db/db.json', JSON.stringify(dbData, null, '\t'), (err) =>
        err ? console.log(err) : console.log('Successfully updated database!')
    );

    // respond with the info in the database
    res.json(dbData)
})


app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);