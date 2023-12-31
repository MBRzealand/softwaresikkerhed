const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const cors = require("cors");
app.set('trust proxy', true)
app.disable('x-powered-by');
const port = 5444
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());


let fs = require('fs');
let logStream = fs.createWriteStream('log.txt', {flags: 'a'});

// logStream.write('Initial line...');
// logStream.end('this is the end line');

const getCurrentDate = () => {
    let currentdate = new Date();
    return currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds()
}


let db = new sqlite3.Database('notes.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('\nConnected to the in-memory SQlite database.');
    logStream.write("\nServer started at: " + getCurrentDate())
});

app.post('/save-note', (req, res) => {

    const { number, title, text, iv } = req.body;

    const insertQuery = `INSERT INTO notes (number, title, text, iv) VALUES (?, ?, ?, ?)`;

    db.run(insertQuery, [number, title, text, iv], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error adding element to the database' });
        } else {
            console.log(`Element added with ID: ${this.lastID}`);
            logStream.write("\nNote saved by: " + req.ip + " at: " + getCurrentDate())
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
            logStream.write("\nNotes fetched by: " + req.ip + " at: " + getCurrentDate())
            res.json({ notes: rows });
        }
    });
});

app.delete('/delete-note/:id', (req, res) => {
    const noteId = req.params.id;

    const deleteQuery = `DELETE FROM notes WHERE number = ?`;

    db.run(deleteQuery, [noteId], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error deleting the element from the database' });
        } else {
            logStream.write("\nNote number: " + noteId + " deleted by: " + req.ip + " at: " + getCurrentDate())
            res.json({ message: 'Element deleted from the database' });
        }
    });
});

app.put('/update-note/:id', (req, res) => {
    const  noteId  = req.params.id;
    const {title, text, iv}  = req.body;

    const updateQuery = `UPDATE notes SET title = ?, text = ?, iv = ? WHERE number = ?`

    db.run(updateQuery,
        [title, text, iv, noteId],
        (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to update note' });
            } else {
                logStream.write("\nNote number: " + noteId + " updated by: " + req.ip + " at: " + getCurrentDate())
                res.json({ message: 'Note updated successfully' });
            }
        }
    );
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app


