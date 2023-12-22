const mongoose = require("mongoose");
require('dotenv').config();

const db = process.env.LINK


mongoose.connect(db)
.then(()=>{
    console.log("Database connected successfully")
}) .catch((err) => {
    console.log(err.message)
})