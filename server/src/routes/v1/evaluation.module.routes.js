const {Router}=require("express");
const EvaluationModuleRouter=Router();
const {getAllModules}=require("../../controllers/evaluation.module.controller");

EvaluationModuleRouter.get('/',getAllModules);

module.exports=EvaluationModuleRouter
