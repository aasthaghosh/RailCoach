/** @format */

// import the router from the express
const express = require("express");
const router = express.Router();

// import the AuthCoach.js from the Controller
const {
  CoachData,
  allCoachData,
  updateCoach,
  completeMaintenance,
  requestMaintenance,
  approveMaintenance,
} = require("../Controller/AuthCoach");

// admin middleware
const { AdminAuth, isadmin } = require("../middleware/AdminAuth");

// to create the route
router.post("/coachdata", CoachData);
router.get("/allcoach", allCoachData);
router.patch("/coach/:id", updateCoach);
router.patch("/coach/:id/maintenance-done", completeMaintenance);
router.post("/coach/:id/request-maintenance", requestMaintenance);
router.patch(
  "/coach/:id/approve-maintenance",
  AdminAuth,
  isadmin,
  approveMaintenance
);

// to export the router
module.exports = router;
