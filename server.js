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
    // no need for this new object because the outcome is the same as the req.body
    const newNote = { title: req.body.title, text: req.body.text, id: uuid() }

    dbData.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(dbData, null, '\t'), (err) =>
        err ? console.log(err) : console.log('Successfully updated database!')
    );

    res.json(dbData);
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
})

app.delete("/api/notes/:id", (req, res) => {
    // const newArray = dbData.filter(note => {
    //     if (note.id !== req.params.id) return true
    // })

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