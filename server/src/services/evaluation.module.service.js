const SurveyAccess = require("../models/SurveyAccess");
const Survey = require("../models/Survey");
const EvaluationModule = require("../models/EvaluationModule");
const EvaluationModuleItem = require("../models/EvaluationModuleItem");
const EvaluationModuleTask = require("../models/EvaluationModuleTask");
const TaskGroup = require("../models/TaskGroup");
const Item = require("../models/Item");

const getAllModules = () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await EvaluationModule.findAll();

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

const getAllModuleByUserAccess = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await EvaluationModule.findAll({
        include: [
          {
            model: Survey,
            required: true,
            attributes: [],
            include: [
              {
                model: SurveyAccess,
                required: true,
                attributes: [],
                where: {
                  user_id: userId,
                },
              },
            ],
          },
        ],
        raw: true,
        group: ["id_evaluation_module"],
      });

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

const getSchemaModule = (moduleId) =>
  new Promise(async (resolve, reject) => {
    try {
      const schemaTask = await TaskGroup.findAll({
        include: [
          {
            model: EvaluationModuleTask,
            attributes: [],
            required: true,
            where: {
              evaluation_module_id: moduleId,
            },
          },
        ],
      });

      const schemaItem = await Item.findAll({
        include: [
          {
            model: EvaluationModuleItem,
            attributes: [],
            required: true,
            where: {
              evaluation_module_id: moduleId,
            },
          },
        ],
      });

      resolve({
        taskSchema:[...schemaItem],
        itemSchema:[...schemaTask],
      });
    } catch (error) {
      reject(error);
    }
  });
module.exports = {
  getAllModules,
  getAllModuleByUserAccess,
  getSchemaModule
};
