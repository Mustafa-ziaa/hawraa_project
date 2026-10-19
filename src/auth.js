const express = require("express");
const app = express.Router();
const prisma = require('./db');
app.use(express.json())
const jwt = require("jsonwebtoken")

// id    Int    @id @default(autoincrement())
//   name  String
//   userName String @unique @map("user_name")
//   mobileNumber String @map("mobile_number")



// token generator

function tokenGenerator(userName,name) {
    const payload = {
        userName,
        name
    }
    const accessToken = jwt.sign(payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.EXPIREIN
        }
    )

    return accessToken;
}


// register route

app.post("/register", async (req,res)=>{
    const {name,userName,mobileNumber, password} = req.body;
    if (!name || !userName || !mobileNumber || !password) {
        res.status(400).json({message: "all parameters required!"})
    }
    const user = {
        name,
        userName,
        mobileNumber,
        password
    }

    try {
        const newUser = await prisma.user.create({data:user})
        res.status(201).json({newUser});
    } catch (error) {
        res.status(500).json({erorMressage:"something was wrong!"})
    }
})


// login route

app.post("/login",async (req,res)=>{
    const {userName, password} = req.body;
    try {
        const currentUser = await prisma.user.findUnique({where:{userName}});
        if (!currentUser.password) {
            res.status(400).json({
                message: "username or password is wrong!"
            })
            return;
        }

        const currentUserPassword = currentUser.password;
        if (currentUserPassword == password) { 
            const accessToken =  tokenGenerator(currentUser.userName,currentUser.name)
            res.status(200).json({message:"signin sucessfully!",
                accessToken,
                user:{
                    username:currentUser.userName,
                    name:currentUser.name
                }
            })
        }
        
    } catch (error) {
        res.status(500).json({erorMressage:"something was wrong!"})
    }
});

module.exports = app;