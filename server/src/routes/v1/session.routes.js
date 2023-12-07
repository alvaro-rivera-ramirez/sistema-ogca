const {Router}=require("express")
const sessionRouter=Router();
const {loginUser,endSession}=require("../../controllers/session.controller");
const { checkAuth } = require("../../middleware/auth.middleware");

sessionRouter
.get('/',checkAuth,(req,res)=>{
    console.log('paso el checkout')
    res.json({
        name:req.nameUser,
        email:req.emailUser,
        role:req.role
    })
})
.post('/',loginUser)
.delete('/',endSession)

module.exports=sessionRouter