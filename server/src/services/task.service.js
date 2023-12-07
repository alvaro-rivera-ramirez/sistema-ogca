const Tasks = require("../models/Tasks");
const EvaluationModuleTask = require("../models/EvaluationModuleTask");
const { TaskGroupfindById } = require("./taskgroup.service");

const upsertTask = (dataTask, transaction) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(dataTask);
      await Tasks.upsert(dataTask, { transaction });
      resolve();
    } catch (error) {
      console.log(error);
      reject({
        code: 400,
        message: "Error al insertar la tarea",
      });
      // throw new Error(`Error al insertar la tarea ${dataTask}`);
    }
  });

const updateStatus = (tasksObject, surveyId, evaluationModuleId, transaction) =>
  new Promise(async (resolve, reject) => {
    try {
      for (const task of tasksObject) {
        await searchGroupTaskToSurvey(task.idGroupTask, evaluationModuleId);
        const { type_task_group } = await TaskGroupfindById(task.idGroupTask);
        if (task.taskList.length > 0) {
          let promisesTask = null;
          promisesTask = task.taskList?.map(
            async ({ idTask = null, nameTask = null, statusTask }) => {
              let isfulfilled = statusTask == 1 ? 1 : 0;
              if (type_task_group == 2) {
                return await upsertTask(
                  {
                    id_task: idTask,
                    status_task: statusTask,
                    isFulFilled: isfulfilled,
                  },
                  transaction
                );
              } else {
                return await upsertTask(
                  {
                    name_task: nameTask,
                    status_task: statusTask,
                    survey_id: surveyId,
                    task_group_id: task.idGroupTask,
                    isFulFilled: isfulfilled,
                  },
                  transaction
                );
              }
            }
          );

          await Promise.all(promisesTask);
        }

      }
      resolve();
    } catch (error) {
      console.log(error);
      reject({
        code: 400,
        message: "Error al guardar las tareas de la encuesta",
      });
    }
  });

const searchGroupTaskToSurvey = (groupTaskId, evaluationModuleId) =>
  new Promise(async (resolve, reject) => {
    try {
      const groupTaskFound = await EvaluationModuleTask.findOne({
        where: {
          evaluation_module_id: evaluationModuleId,
          task_group_id: groupTaskId,
        },
      });

      if (!groupTaskFound) {
        reject({
          code: 404,
          message: "La tarea no existe en la ficha",
        });
        return;
      }
      resolve(groupTaskFound);
    } catch (error) {
      reject(error);
    }
  });
module.exports = {
  updateStatus,
  searchGroupTaskToSurvey,
};
