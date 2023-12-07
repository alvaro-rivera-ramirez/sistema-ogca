const {Router}=require("express");
const taskRouter=Router();

taskRouter.get('/',(req,res)=>{
    res.send("tareas");
});

module.exports=taskRouter;