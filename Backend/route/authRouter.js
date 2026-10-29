// import the router from the express
const express = require('express')
const router = express.Router();

// import the AuthCoach.js from the Controller
const {auth} = require('../Controller/auth')
const {PendingTasks , ApproveTask , RejectTask} = require('../Controller/AuthTask')
const {AdminAuth , isadmin} = require('../middleware/AdminAuth');
// to create the route
router.get('/me' , AdminAuth , auth);


// !________________________new code______________________________
router.get("/admin/pending-tasks", AdminAuth, isadmin, PendingTasks);
router.patch("/admin/approve-task/:id", AdminAuth, isadmin, ApproveTask);
router.patch("/admin/reject-task/:id", AdminAuth, isadmin, RejectTask);


// to export the router
module.exports = router