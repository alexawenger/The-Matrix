const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// setup for database connection (called db)

//start xampp server, then go to localhost/phpmyadmin
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
app.post('/api/athletes', async (req, res) => {
    const q = "INSERT INTO athletes (FirstName, LastName, GradYear, Gender, Password) VALUES (?, ?, ?, ?, ?);";
    // const values = ["Cam", "Doe", "2021", "Male", "123456"];
    const values = [
        req.body.FirstName,
        req.body.LastName,
        req.body.GradYear,
        req.body.Gender,
        req.body.Password
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.json(err)
        }
        console.log("Athlete inserted successfully:")
        return res.json(data)
    })

})
// END TESTING


app.get('/getLevels', (req, res) => {
    db.query('SELECT * FROM levels', (err, result) => {
        if (err) {
            return res.json(err)
        }
        return res.json(result)
    })
})

app.get('/getEntries', (req, res) => {
    db.query('SELECT * FROM entries', (err, result) => {
        if (err) {
            return res.json(err)
        }
        return res.json(result)
    })
})



app.post("/api/submit-run", async (req, res) => {
  const { date, lift, core, minutes, miles } = req.body;

  console.log(req.body);
  const drQuery = "INSERT INTO distanceruns (minutes, miles) VALUES (?, ?);";
  let input = [minutes, miles];
  // First query execution
  let DistanceRunID;
    db.query(drQuery, input, (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        let my_result = res.json(result);
        DistanceRunID = result.DistanceRunID;
        return my_result;
      }
    });


  const eQuery = "INSERT INTO Entries (date, lift, core, DistanceRunID) VALUES (?, ?, ?, ?);";

  // Second query execution, using result of the first
  db.query(eQuery, [date, lift, core, DistanceRunID], (err, result) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(result);
    }
  });
});

app.post("/api/submit-workout", async (req, res) => {
  const { date, lift, core, type, warmupmin, warmupmi, cooldownmin, cooldownmi} = req.body;

  console.log(req.body);
  const drQuery = "INSERT INTO workouts (type, warmupmin, warmupmi, cooldownmin, cooldownmi) VALUES (?, ?, ?, ?, ?);";
  let input = [type, warmupmin, warmupmi, cooldownmin, cooldownmi];
  // First query execution
  let DistanceRunID;
    db.query(drQuery, input, (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        let my_result = res.json(result);
        WorkoutID = result.WorkoutID;
        return my_result;
      }
    });


  const eQuery = "INSERT INTO Entries (date, lift, core, WorkoutID) VALUES (?, ?, ?, ?);";

  // Second query execution, using result of the first
  db.query(eQuery, [date, lift, core, WorkoutID], (err, result) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(result);
    }
  });
});