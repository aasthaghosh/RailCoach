const mongoose = require("mongoose");
const dns = require("dns");

// Use Google Public DNS to resolve MongoDB Atlas SRV queries (fixes ECONNREFUSED on Jio/ISP DNS)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// to load the url in the .env file
require('dotenv').config();

const dbconnect = () =>{

    mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log('db is connected'))
    .catch((err)=>console.log(err))
}

// export the file
module.exports =  dbconnect