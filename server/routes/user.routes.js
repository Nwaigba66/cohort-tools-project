const express = require ("express");
const router = express.router;
const UserModel = require("../Models/User.model.js")
const { isAuthenticated } = require("../Middleware/jwt.middleware");


router.get("/api/users/:id", 
isAuthenticated,
 async (req,res)=>{
    try{
        const userId= req.params.id;
        const user = await UserModel.findById(userId);
        if (!user){
            return res.status(404).json({message: "User not found"});
        }
else {
    return res.status(200).json({message: "User found"});
}

        }catch (err){
            console.error(err)
            res.status(500).json({message:"Server error", error: err.message});
        }
    })


module.exports= router;