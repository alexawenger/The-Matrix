const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())

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