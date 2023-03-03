const mongoose =require("mongoose");
 
const DB =process.env.DATABASE;

// pasword =uy5cMX3o7mzMvzMk
mongoose.connect(DB).then(()=>console.log("data base connected")).catch((error) => console.log("error" +error.message))