const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE A SCHEMA
const studentsSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phone: { type: String },
  linkedinUrl: { type: String },
  languages: { type: Array },
  program: { type: String },
  background: { type: String },
  image: { type: String },
  cohort: { type: Schema.Types.ObjectId, ref: "Cohorts" },
  projects: { type: Array },
});

// CREATE A MODEL
const StudentsModel = mongoose.model("Students", studentsSchema);

// EXPORT THE MODEL
module.exports = StudentsModel;
