const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// setup for database connection (called db)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '326petition'
})

app.listen(8081, () => {
    console.log("Server started on port 8081")
})

// TESTING HERE
// app.get('/api/customers', (req, res) => {
//     const customers = [
//         { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@gmail.com' },
//         { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@gmail.com' },
//         { id: 3, firstName: 'Bob', lastName: 'Smith', email: 'bob@gmail.com' }
//     ];
//     res.json(customers);
// })


// // example - this should not need to be used anywhere
// app.get('/Athletes', (req, res) => {
//     db.query('SELECT * FROM athletes', (err, result) => {
//         if (err) {
//             return res.json(err)
//         }
//         return res.json(result)
//     })
// })

// app.post('/Athletes', async (req, res) => {
//     const q = "INSERT INTO athletes (AthleteID, FirstName, LastName, GradYear, Gender, Password) VALUES (?, ?, ?, ?, ?, ?);";
//     const values = ["3", "John", "Doe", "2021", "M", "123456"];
//     // const values = [
//     //     req.body.AthleteID,
//     //     req.body.FirstName,
//     //     req.body.LastName,
//     //     req.body.GradYear,
//     //     req.body.Gender,
//     //     req.body.Password
//     // ]

//     db.query(q, values, (err, data) => {
//         if (err) {
//             return res.json(err)
//         }
//         return res.json("Athlete inserted successfully: ", data)
//     })

// })
// END TESTING


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