const express = require("express")
const path = require("path");

const app = express();

require("dotenv").config({
    path: path.resolve(__dirname,'../.env')
});

app.get("/",(req,res)=>{
    res.status(301).
    json({
        server_state: "OK",
    })
})

const auth = require("./auth");

app.use("/auth",auth);


app.listen(process.env.PORT, ()=>{
    console.log(`server is runing on port ${process.env.PORT} `);
});
