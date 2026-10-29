// to connect the database using the mongoose;
const mongoose = require("mongoose")

// to load the url in the .env file
require('dotenv').config();

const dbconnect = () =>{

    mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log('db is connected'))
    .catch((err)=>console.log(err))
}

// export the file
module.exports =  dbconnect