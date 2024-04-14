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
    database: 'petition'
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

