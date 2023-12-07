const {Router}=require("express");
const userRouter=Router();
const {createUser,getAllUsers, getAllUserWithOutAccessSurvey}=require("../../controllers/user.controller");
const { checkRole } = require("../../middleware/auth.middleware");

userRouter.get("/",getAllUsers)
.post("/",createUser)
.get("/without-access/survey/:codeSurvey",checkRole([1,2]),getAllUserWithOutAccessSurvey)

module.exports=userRouter;
