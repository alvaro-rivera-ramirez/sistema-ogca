const {Router}=require("express");
const EvaluationModuleRouter=Router();
const {getAllModules, getSchema}=require("../../controllers/evaluation.module.controller");

EvaluationModuleRouter.get('/',getAllModules);
EvaluationModuleRouter.get('/:moduleId/schema',getSchema);
module.exports=EvaluationModuleRouter
