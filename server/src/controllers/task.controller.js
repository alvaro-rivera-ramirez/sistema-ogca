const sequelize=require("../config/database");
const TaskService=require("../services/task.service");
const {findSurvey}=require("../services/survey.service");
const {handleErrorResponse,handleHttpError}=require("../middleware/handle.error.middleware");

const updateStatusTask=async(req,res)=>{
    const transaction=await sequelize.transaction();
    try {
        const {task,code,item={}}=req.body;

        const {id_survey}=await findSurvey(code);
        await TaskService.updateStatus(task,id_survey,transaction);
        /**
         * {
         *  code:ASCNFR454FG567,
         *  task:[
         *      {
         *          type:1,(1:tareas editadas por usuario o 2:tareas ya preescritas)
         *          idgrouptask:23,
         *          list:[
         *              {
         *                 idtask:12 || null, 
         *                 nametask:"lorem lorem lorem" || null
         *                 isfulfilled:1,
         *                 status:-1 || 0 || 1
         *              }
         *          ]
         *      },
         *      {
         *          type:1,
         *          idgrouptask:24,
         *          idtask:13,
         *          list:[
         *              {
         *                 idtask:14 || null, 
         *                 nametask:"lorem lorem lorem" || null
         *                 isfulfilled:1,
         *                 status:-1 || 0 || 1
         *              }
         *          ]
         *       }
         * ],
         * item:[
         *      {
         *          iditem:2,
         *          value:[
         *              "lorem lorem lorem",
         *              "lorem lorem lorem",
         *              "lorem lorem lorem"
         *          ]
         *      }
         * 
         * ]
         */
        
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        if(typeof error.code=="number"){
            handleErrorResponse(res,error.message,error.code)
            return;
        }
        handleHttpError(res,error);
    }


}

module.exports={
    
}