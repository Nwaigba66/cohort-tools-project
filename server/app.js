const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5005;
const cors = require("cors");
const mongoose = require("mongoose");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
// const cohort = require("./cohorts.json");
// const students = require("./students.json");
const Students = require("./Models/students.model");
const Cohorts = require("./Models/cohorts.model");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// get all Students

app.get("/api/students", (req, res) => {
  Students.find()
    .then((allStudents) => {
      console.log("All students retrieved", allStudents);
      res.status(200).json(allStudents);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while getting the Students" });
    });
});
// get all Cohorts

app.get("/api/cohorts", (req, res) => {
  Cohorts.find()
    .then((allCohorts) => {
      console.log("All cohorts retrieved");
      res.status(200).json(allCohorts);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while getting the Cohorts" });
    });
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  Cohorts.findById(req.params.id)
    .then((cohort) => {
      console.log(req.params, cohort);
      res.status(200).json(cohort);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while finding the recipe" });
    });
});

app.get("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  console.log("made it to the students route", studentId, req.params);
  res.status(200).json();
});

app.delete("/api/students/:studentId", (req, res) => {
  Students.findByIdAndDelete("616c4b4c649eaa001dd50f86")
    .then((deleteStudent) => {
      console.log("deleted by Id", deleteStudent);
    })
    .catch((err) => console.log(err));
});
// });
// app.get("/api/cohorts", (req, res) => {
//   res.json(cohort);
// });

// app.get("/api/students", (req, res) => {
//   res.json(students);
// });

// app.get("/api/students/cohort/:cohortId", (req, res) => {
//   Cohorts.findbyId(req.params.id)
//     .populate("students")
//     .then((allStudents) => {
//       res.status(200).json(allStudents);
//     })
//     .catch((error) => {
//       res.status(500).json({ message: "Error while getting the Students" });
//     });
// });

// app.get("/api/students/cohort/:cohortId", (req, res) => {
//   Students.find()
//     .then((allStudents) => {
//       res.status(200).json(allStudents);
//     })
//     .catch((error) => {
//       res.status(500).json({ message: "Error while getting the Students" });
//     });
// });

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));
