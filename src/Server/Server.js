const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const cors = require("cors");
const port = 5444
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());


let db = new sqlite3.Database('notes.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

app.post('/save-note', (req, res) => {

    const { number, title, text } = req.body;

    const insertQuery = `INSERT INTO notes (number, title, text) VALUES (?, ?, ?)`;

    db.run(insertQuery, [number, title, text], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error adding element to the database' });
        } else {
            console.log(`Element added with ID: ${this.lastID}`);
            res.json({ message: 'Element added to the database' });
        }
    });
});


app.get('/get-notes', (req, res) => {
    const selectQuery = `SELECT * FROM notes`;

    db.all(selectQuery, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error retrieving elements from the database' });
        } else {
            res.json({ notes: rows });
        }
    });
});

app.delete('/delete-note/:id', (req, res) => {
    // Extract the element ID from the URL parameter
    const noteId = req.params.id;

    const deleteQuery = `DELETE FROM notes WHERE number = ?`;

    // Execute the query to delete the element
    db.run(deleteQuery, [noteId], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error deleting the element from the database' });
        } else {
            res.json({ message: 'Element deleted from the database' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app

