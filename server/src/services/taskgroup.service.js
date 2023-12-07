const TaskGroup=require("../models/TaskGroup");

const TaskGroupfindById=(id)=> new Promise(async(resolve, reject) => {
    try {
        const taskGroupFound=await TaskGroup.findByPk(id);
        if(!taskGroupFound){
            reject({
                code:404,
                message:"No existe la tarea"
            });
            return;
        } 

        resolve(taskGroupFound);
    } catch (error) {
        reject(error)
    }
})

module.exports={
    TaskGroupfindById
}