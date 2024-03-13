const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '326petition'
})

app.get('/getAthletes', (req, res) => {
    db.query('SELECT * FROM athletes', (err, result) => {
        if (err) {
            return res.json(err)
        }
        return res.json(result)
    })
})

app.listen(8081, () => {
    console.log("listening!!")
})

app.get('/getLevels', (req, res) => {
    db.query('SELECT * FROM levels', (err, result) => {
        if (err) {
            return res.json(err)
        }
        return res.json(result)
    })
})

app.post('/submitDistEntry', async (req, res) => {
    try {
        const { date, lift, core, minutes, miles } = req.body;
        const drQuery = 'INSERT INTO DistanceRuns (minutes, miles) VALUES (?, ?);';

        // First query execution
        const drResult = await new Promise((resolve, reject) => {
            db.query(drQuery, [minutes, miles], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        const eQuery = 'INSERT INTO Entries (date, lift, core, DistanceRunID) VALUES (?, ?, ?, ?);';
        
        // Second query execution, using result of the first
        const eResult = await new Promise((resolve, reject) => {
            db.query(eQuery, [date, lift, core, drResult.insertId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Respond with the result of the second query
        res.json(eResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});