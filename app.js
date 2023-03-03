require("dotenv").config();
const express =require("express");
const app =express()
const mongoose = require("mongoose");
require("./db/conn"); 
const cookieParser = require("cookie-parser");

const Products =require("./models/ProductSchema");

const DefaultData =require("./defaultdata");
const cors =require("cors");
const router =require("./routes/router")

app.use(express.json());
app.use(cookieParser(""));
app.use(cors());
app.use(router);


const port =process.env.PORT || 5000; 
//static fies
app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

// for deployemnt
// if (process.env.NODE_ENV === "production"){
//     app.use(express.static("client/build"));
// }

app.listen(port,()=>{
    console.log(`hello i am hearing on the port ${port}`);
})

DefaultData()

   // "test": "echo \"Error: no test specified\" && exit 1",{is line ko pakae .js me script ke andar dallna hai }