/** @format */

const { Schema, model } = require("mongoose");

// to crate the Coach Scheme

const CoachSchema = new Schema({
  coachNumber: {
    type: String,
    required: true,
    unique: true, // Add unique constraint
    trim: true, // Remove whitespace
  },
  type: {
    type: String,
    required: true,
  },
  depot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "under maintenance", "out of service"],
  },
  lastMaintenance: {
    type: Date,
    required: true,
  },
  nextDue: {
    type: Date,
    required: true,
  },
  // flag when a maintenance request has been sent and awaiting admin approval
  maintenanceRequested: {
    type: Boolean,
    default: false,
  },
  maintenanceRequestAt: {
    type: Date,
  },
  maintenanceRequestedBy: {
    type: String,
  },
});

// to create the model;
const Coach = model("Coach", CoachSchema);

// to export the model
module.exports = Coach;
