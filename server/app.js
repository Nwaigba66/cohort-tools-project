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
const StudentsModel = require("./Models/students.model");
const CohortsModel = require("./Models/cohorts.model");

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

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// get all Students
app.get("/api/students", (req, res) => {
  StudentsModel.find()
    .then((allStudents) => {
      // console.log("All students retrieved", allStudents);
      res.status(200).json(allStudents);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while getting the Students" });
    });
});

// get all Cohorts
app.get("/api/cohorts", (req, res) => {
  CohortsModel.find()
    .then((allCohorts) => {
      console.log("All cohorts retrieved");
      res.status(200).json(allCohorts);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while getting the Cohorts" });
    });
});

// get specific Cohort by ID
app.get("/api/cohorts/:cohortId", (req, res) => {
  CohortsModel.findById(req.params.cohortId)
    .then((oneCohort) => {
      console.log("oneCohort", req.params.cohortId);
      res.status(200).json(oneCohort);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while finding the Cohort" });
    });
});

// get specific Student by Id and populate with the Cohort Data
app.get("/api/students/:studentId", (req, res) => {
  StudentsModel.findById(req.params.studentId)
    .populate("cohort")
    .then((oneStudent) => {
      console.log(oneStudent);
      res.status(200).json(oneStudent);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error while finding the Student" });
    });
});

//display all students for a specific cohort
app.get("/api/students/cohort/:cohortId", (req, res) => {
  StudentsModel.find({ cohort: req.params.cohortId })
    .then((Students) => {
      console.log(Students);
      res.status(200).json(Students);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error while finding the Student" });
    });
});

// delete a Specific Student by ID

app.delete("/api/students/:studentId", (req, res) => {
  StudentsModel.findByIdAndDelete(req.params.studentId)
    .then((deletedStudent) => {
      console.log(req.params.studentId);
      if (!deletedStudent) {
        res.status(500).json({ message: "that's a mistake!💀✨👀🪠💪" }); //best error message ever
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "that's a mistake!💀✨👀🪠💪" }); //best error message ever
    });
});

// delete a specific Cohort by ID
app.delete("/api/cohorts/:cohortId", (req, res) => {
  CohortsModel.findByIdAndDelete(req.params.cohortId)
    .then((deletedCohort) => {
      if (!deletedCohort) {
        res.status(500).json({ message: "that's a mistake!💀✨👀🪠💪" }); //best error message ever
      } else {
        StudentsModel.updateMany({ cohort: req.params.cohortId }, { cohort: "undefined" });
        res.status(204).send();
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "that's a mistake!💀✨👀🪠💪" }); //best error message ever
    });
});

// Updating a specific Student
app.put("/api/students/:studentId", async (req, res) => {
  //   const studentId = req.params.studentId;
  const { studentId } = req.params;
  try {
    const updatedStudent = await StudentsModel.findByIdAndUpdate(studentId, req.body, {
      new: true,
    });
    if (!updatedStudent) {
      res.status(500).json({ errorMessage: "Student not found" });
    } else {
      res.status(200).json({ message: "Student updated successfully", updatedStudent });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: "Student not found" });
    console.log("Student not found");
  }
});

// Updating a specific Cohort
app.put("/api/cohorts/:cohortId", async (req, res) => {
  const { cohortId } = req.params;
  try {
    const updatedCohort = await CohortsModel.findByIdAndUpdate(cohortId, req.body, {
      new: true,
    });
    if (!updatedCohort) {
      res.status(500).json({ errorMessage: "Cohort not found" });
    } else {
      res.status(200).json({ message: "Cohort updated successfully", updatedCohort });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: "Cohort not found" });
    console.log("Cohort not found");
  }
});

// Creating a new Student

app.post("/api/students", (req, res) => {
  StudentsModel.create(req.body)
    .then((newStudent) => {
      res.status(201).json(newStudent);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

app.post("/api/cohorts", (req, res) => {
  CohortsModel.create(req.body)
    .then((newCohort) => {
      res.status(201).json(newCohort);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// app.delete("/api/cohorts/:cohortId", async (req, res) => {
//   try {
//     const deletedCohort = await CohortsModel.findByIdAndDelete(req.params.cohortId);
//     res.status(204).end();
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err });
//   }
// });

/////////////////////////////////////////////////////////////////

// app.get("/api/students/:studentId", (req, res) => {
//   const { studentId } = req.params;
//   console.log("made it to the students route", studentId, req.params);
//   res.status(200).json();
// });

// app.delete("/api/students/:studentId", (req, res) => {
//   StudentsModel.findByIdAndDelete("616c4b4c649eaa001dd50f86")
//     .then((deleteStudent) => {
//       console.log("deleted by Id", deleteStudent);
//     })
//     .catch((err) => console.log(err));
// });
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
