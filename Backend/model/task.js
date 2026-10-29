/** @format */

// to import the mongoose
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// to create the Task Schema
const TaskSchema = new Schema({
  selectCoach: {
    // this is for the Coach Schema referance;
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coach",
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    required: true,
  },
  department: {
    type: String,
    enum: [
      "admin",
      "mechanical",
      "electrical",
      "signal_telecom",
      "carriage_wagon",
      "traction",
      "operations",
      "engineering",
      "railway_safety",
      "maintenance",
    ],
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
    default: "PENDING",
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

// to create the model
const Task = model("Task", TaskSchema);
// to export the Task
module.exports = Task;
