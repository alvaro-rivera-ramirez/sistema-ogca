const { handleErrorResponse, handleHttpError } = require("../middleware/handle.error.middleware");
const EvaluationModuleService=require("../services/evaluation.module.service");

const getAllModules=async(req,res)=>{
    try {
        const {role,iduser}=req;
        let results=[];

        if(![1,2].includes(role)){
            results=await EvaluationModuleService.getAllModuleByUserAccess(iduser);
        }else{
            results=await EvaluationModuleService.getAllModules();
            
        }
        res.send(results);
    } catch (error) {
        handleHttpError(res,error);
    }
};

module.exports={
    getAllModules,
}