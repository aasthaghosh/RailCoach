// import the express
const express = require('express')
const router = express.Router();


// import the AuthUser.js from the Controller
const {singup , login , logout} = require("../Controller/AuthUser");

const {AdminAuth, isadmin} = require('../middleware/AdminAuth');

// to create the route
router.post("/singup", AdminAuth ,isadmin , singup);
router.post("/login" , login)
router.post("/logout",AdminAuth , logout)

// export the router
module.exports = router