
const express = require("express");
const router = express.Router();

const sendEmail = require("../Controller/mailer");
router.post('/send_email' , sendEmail)

    
module.exports = router;