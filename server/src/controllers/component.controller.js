const { handleHttpError, handleErrorResponse } = require("../middleware/handle.error.middleware")
const componentService=require("../services/component.service")

const getComponents=async(req,res)=>{
    try {
        const components=await componentService.getAllComponents(req.query)

        res.json(components)
    } catch (error) {
        if(typeof error.code=="number"){
            return handleErrorResponse(res,error.message,error.code)
        }
        return handleHttpError(res,error)
    }
}

module.exports={
    getComponents
}