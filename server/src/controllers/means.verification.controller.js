const { handleErrorResponse, handleHttpError } = require("../middleware/handle.error.middleware");
const meansVerificationService=require("../services/mean.verification.service");

const getAllMeansVerification=async(req,res)=>{
    try {
        const data=await meansVerificationService.getAll(req.query);
        res.json(data);
    } catch (error) {
        if(typeof error.code=="number"){
            return handleErrorResponse(res,error.message,error.code)
        }
        return handleHttpError(res,error)
    }
}

module.exports={
    getAllMeansVerification
}