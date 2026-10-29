/** @format */

// import the router from the express
const express = require("express");
const router = express.Router();

// import the AuthTask.js from the Controller
const {
  TaskData,
  AllTask,
  DeleteTask,
  CompleteTask,
} = require("../Controller/AuthTask");
const { AdminAuth, isadmin } = require("../middleware/AdminAuth");

// to create the route
router.post("/taskdata", AdminAuth, TaskData);
router.get("/alltaskdata", AdminAuth, AllTask);
router.delete("/deletetask/:id", AdminAuth, DeleteTask);
router.patch("/task/:id/complete", AdminAuth, CompleteTask);

// to export the router
module.exports = router;
