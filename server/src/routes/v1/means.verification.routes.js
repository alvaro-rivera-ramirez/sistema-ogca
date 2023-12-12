const {Router}=require("express");
const { getAllMeansVerification } = require("../../controllers/means.verification.controller");
const mvRouter=Router();

mvRouter.get('/',getAllMeansVerification);

module.exports=mvRouter;