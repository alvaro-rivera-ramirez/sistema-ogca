const { handleHttpError, handleErrorResponse } = require("../middleware/handle.error.middleware")
const conditionService=require("../services/condition.service")

const getConditions=async(req,res)=>{
    try {
        const conditions=await conditionService.getAllConditions(req.query)

        res.json(conditions)
    } catch (error) {
        if(typeof error.code=="number"){
            return handleErrorResponse(res,error.message,error.code)
        }
        return handleHttpError(res,error)
    }
}

module.exports={
    getConditions
}