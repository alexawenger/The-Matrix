// This file contains the database connection and the functions to query the database.
// It also contains the endpoints for the backend server.

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const async = require('async');


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
    database: 'petition'
})

app.listen(8081, () => {
    console.log("Server started on port 8081")
})

app.get('/getLevels', (req, res) => {
    db.query('SELECT * FROM levels', (err, result) => {
        if (err) {
            return res.json(err)
        }
        return res.json(result)
    })
})

app.post("/submit-run", async (req, res) => {
  const { date, lift, core, minutes, miles } = req.body;

  const drQuery = "INSERT INTO distanceruns (Minutes, Miles) VALUES (?, ?);";
  let input = [minutes, miles];
  // First query execution
    db.query(drQuery, input, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      } else {
        DistanceRunID = result.insertId;
        const eQuery = "INSERT INTO Entries (date, lift, core, DistanceRunID) VALUES (?, ?, ?, ?);";

        // Second query execution, using result of the first
        db.query(eQuery, [date, lift, core, DistanceRunID], (err, result) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err });
            });
          } else {
            res.json(result);
          }
        });
      }
    });  
});


app.post('/submit-workout', (req, res) => {
  console.log("in submit workout", req.body);
  const { date, lift, core, type, warmupMins, warmupMiles, cooldownMins, cooldownMiles, reps } = req.body;
  const workoutQuery = "INSERT INTO workouts (Type, WarmupMins, WarmupMiles, CooldownMins, CooldownMiles) VALUES (?, ?, ?, ?, ?);";

  console.log(type, warmupMins, warmupMiles, cooldownMins, cooldownMiles); // Log to check values
  db.query(workoutQuery, [type, warmupMins, warmupMiles, cooldownMins, cooldownMiles], (err, result) => {
    if(err){
      return res.status(500).json({ error: err });
    }else{
      workoutID = result.insertId;
      const eQuery = "INSERT INTO Entries (date, lift, core, workoutID) VALUES (?, ?, ?, ?);";

      db.query(eQuery, [date, lift, core, workoutID], (err, result) => {
        if(err){
          return res.status(500).json({ error: err });
        } else{
           // Loop over reps and insert each one
           async.eachSeries(reps, (rep, callback) => {
            const repQuery = "INSERT INTO reps (workoutID, distance, seconds, restSecs) VALUES (?, ?, ?, ?);";
            db.query(repQuery, [workoutID, rep.distance, rep.time, rep.rest], (err, result) => {
              callback(err);
            });
          }, (err) => {
            if (err) {
              return res.status(500).json({ error: err });
            } else {
              return res.json( {message: 'Workout inserted successfully', result});
            }
          });
        }
      });
    }
  });
});

// query to fetch all entries for the month
app.get('/getEntries', (req, res) => {
  let cal_query = `SELECT
                    e.Date,
                    CASE 
                      WHEN dr.DistanceRunID IS NOT NULL THEN 'Distance Run'
                      WHEN w.WorkoutID IS NOT NULL THEN w.Type
                      ELSE 'No Activity'
                    END AS Activity_Type,
                    COALESCE(dr.Minutes, 0) + 
                    COALESCE(w.WarmupMins, 0) + COALESCE(w.CooldownMins, 0) + 
                    COALESCE(SUM(r.Seconds)/60, 0) AS Total_Minutes,
                    COALESCE(dr.Miles, 0) + 
                    COALESCE(w.WarmupMiles, 0) + COALESCE(w.CooldownMiles, 0) + 
                    COALESCE(SUM(r.Distance/1600.0), 0) AS Total_Miles
                  FROM
                    Entries e
                  LEFT JOIN
                    DistanceRuns dr ON e.DistanceRunID = dr.DistanceRunID
                  LEFT JOIN
                    Workouts w ON e.WorkoutID = w.WorkoutID
                  LEFT JOIN
                    Reps r ON w.WorkoutID = r.WorkoutID
                  GROUP BY
                    e.Date, e.WorkoutID, e.DistanceRunID, w.Type, dr.Minutes, dr.Miles, w.WarmupMins, w.CooldownMins, w.WarmupMiles, w.CooldownMiles
                  ORDER BY
                    e.Date`;
  db.query(cal_query, (err, result) => {
    if (err) {
    return res.json(err);
    }
    return res.json(result);
   });
});

