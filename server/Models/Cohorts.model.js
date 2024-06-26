const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE A SCHEMA
const cohortsSchema = new Schema({
  cohortSlug: { type: String },
  
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  inProgress: { type: Boolean, default: true },
  programManager: { type: String },
  leadTeacher: { type: String },
  totalHours: { type: Number },
});

// CREATE A MODEL
const CohortsModel = mongoose.model("Cohorts", cohortsSchema);

// EXPORT THE MODEL
module.exports = CohortsModel;
