// connect to other files and middleware
const express = require('express');
const path = require('path');
const dbData = require('./db/db.json');
const fs = require("fs")
const uuid = require('./utils/uuid');

const PORT = 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));

app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html")));

app.get("/api/notes", (req, res) => res.json(dbData));

app.post("/api/notes", (req, res) => {

    const newNote = { title: req.body.title, text: req.body.text, id: uuid() }

    dbData.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(dbData, null, '\t'), (err) =>
        err ? console.log(err) : console.log('Successfully updated database!')
    );

    res.json(dbData);
})




// // POST request to add a review
// // NOTE: Data persistence isn't set up yet, so this will only exist in memory until we implement it
// app.post('/api/notes', (req, res) => {
//     // Log that a POST request was received
//     console.info(`${req.method} request received to add a note`);

//     // Destructuring assignment for the items in req.body
//     const { text, title } = req.body;

//     // If all the required properties are present
//     if (text && title) {
//       // Variable for the object we will save
//       const newNote = {
//         text,
//         title,
//         noteID: uuid(),
//       };

//       const response = {
//         status: 'success',
//         body: newNote,
//       };

//       console.log(response);
//       res.status(201).json(response);
//     } else {
//       res.status(500).json('Error in posting note');
//     }
//   });





app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
})

app.delete("/api/notes/:id", (req, res) => {

    for (let i = 0; i < dbData.length; i++) {
        if (dbData[i].id == req.params.id) {
            dbData.splice(i, 1)
        }
    }

    fs.writeFile('./db/db.json', JSON.stringify(dbData, null, '\t'), (err) =>
        err ? console.log(err) : console.log('Successfully updated database!')
    );

    res.json(dbData)
})


app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);