const express = require('express');
const path = require('path');
const dbData = require('./db/db.json');
const fs = require("fs")

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
    const newNote = { title: req.body.title, text: req.body.text }
    console.log(req.body)
    console.log(newNote)
    res.json("goodbye")
})


//appendfile or writefile



app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
})

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);