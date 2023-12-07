const {Router}=require("express")
const {getConditions}=require("../../controllers/condition.controller")
const conditionRouter=Router()

conditionRouter.get('/',getConditions);

module.exports=conditionRouter