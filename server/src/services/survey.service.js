const { Sequelize, Op, QueryTypes } = require("sequelize");
const sequelize = require("../config/database");
const Survey = require("../models/Survey");
const MeansVerification = require("../models/MeansVerification");
const Components = require("../models/Components");
const Tasks = require("../models/Tasks");
const Indicators = require("../models/Indicators");
const Conditions = require("../models/Conditions");
const SurveyItem = require("../models/SurveyItem");
const EvaluationModule = require("../models/EvaluationModule");
const SurveyAccess = require("../models/SurveyAccess");

const {
  SurveyViewDTO,
  ComponentDTO,
  ConditionDTO,
  IndicatorDTO,
  MeansVerificationDTO,
  TasksDTO,
  ModuleDTO,
  InstituteDTO,
  GroupTaskDTO,
  ItemDTO,
  SurveyItemDTO,
} = require("../dto/survey.dto");
const Institutes = require("../models/Institutes");
const TaskGroup = require("../models/TaskGroup");
const EvaluationModuleTask = require("../models/EvaluationModuleTask");
const Item = require("../models/Item");
const EvaluationModuleItem = require("../models/EvaluationModuleItem");

const getAllSurveys = (query) => {
  return new Promise(async (resolve, reject) => {
    const {
      search = "",
      institute = null,
      module = "",
      page = 1,
      limit = 8,
    } = query;

    const whereSurvey = {};
    const whereInstitute = {};
    const whereEvaluationModule = {};

    if (search) {
      whereSurvey[Op.or] = [
        Sequelize.where(
          Sequelize.col("content_means_verification"),
          "LIKE",
          `%${search}%`
        ),
        Sequelize.where(
          Sequelize.col("content_indicator"),
          "LIKE",
          `%${search}%`
        ),
        Sequelize.where(
          Sequelize.col("content_component"),
          "LIKE",
          `%${search}%`
        ),
        Sequelize.where(
          Sequelize.col("content_condition"),
          "LIKE",
          `%${search}%`
        ),
      ];
    }

    if (institute) {
      whereInstitute[Op.or] = [
        {
          id_institute: institute,
        },
      ];
    }

    if (module) {
      whereEvaluationModule[Op.or] = [
        {
          id_evaluation_module: module,
        },
        {
          code_evaluation_module: module,
        },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Survey.findAndCountAll({
      include: [
        {
          model: MeansVerification,
          attributes: [
            ["code_means_verification", "code"],
            ["name_means_verification", "name"],
            ["content_means_verification", "content"],
          ],
          required: true,
          include: [
            {
              model: Institutes,
              required: true,
              where: whereInstitute,
            },
          ],
        },
        {
          model: Indicators,
          required: true,
          attributes: [
            ["code_indicator", "code"],
            ["name_indicator", "name"],
            ["content_indicator", "content"],
          ],
        },
        {
          model: Components,
          required: true,
          attributes: [
            ["code_component", "code"],
            ["name_component", "name"],
            ["content_component", "content"],
          ],
        },
        {
          model: Conditions,
          required: true,
          attributes: [
            ["code_condition", "code"],
            ["name_condition", "name"],
            ["content_condition", "content"],
          ],
        },
        {
          model: EvaluationModule,
          required: true,
          where: whereEvaluationModule,
        },
      ],
      attributes: [
        [Sequelize.fn("HEX", Sequelize.col("code_survey")), "codeSurvey"],
        [
          Sequelize.fn(
            "concat",
            Sequelize.col("pre_code_survey"),
            " ",
            Sequelize.col("code_condition"),
            ".",
            Sequelize.col("code_component"),
            ".",
            Sequelize.col("code_indicator"),
            ".",
            Sequelize.col("code_means_verification")
          ),
          "codeSurvey2",
        ],
        ["allowed_edit_survey", "allowedEdit"],
        ["status_survey","statusSurvey"]
      ],
      where: whereSurvey,
      offset: parseInt(offset),
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(count / limit);

    resolve({
      surveys: rows,
      totalRecords: count,
      totalPages,
      currentPage: page,
    });
  });
};

const getMySurveys = (query, userId) =>
  new Promise(async (resolve, reject) => {
    const {
      search = "",
      institute = null,
      module = "",
      page = 1,
      limit = 8,
    } = query;

    const whereSurvey = {};
    const whereInstitute = {};
    const whereEvaluationModule = {};

    if (search) {
      whereSurvey[Op.or] = [
        Sequelize.where(
          Sequelize.col("content_means_verification"),
          "LIKE",
          `%${search}%`
        ),
        Sequelize.where(
          Sequelize.col("content_indicator"),
          "LIKE",
          `%${search}%`
        ),
        Sequelize.where(
          Sequelize.col("content_component"),
          "LIKE",
          `%${search}%`
        ),
        Sequelize.where(
          Sequelize.col("content_condition"),
          "LIKE",
          `%${search}%`
        ),
      ];
    }

    if (institute) {
      whereInstitute[Op.or] = [
        {
          id_institute: institute,
        },
      ];
    }

    if (module) {
      whereEvaluationModule[Op.or] = [
        {
          code_evaluation_module: module,
        },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Survey.findAndCountAll({
      include: [
        {
          model: MeansVerification,
          attributes: [
            ["code_means_verification", "code"],
            ["name_means_verification", "name"],
            ["content_means_verification", "content"],
          ],
          required: true,
          include: [
            {
              model: Institutes,
              required: true,
              where: whereInstitute,
            },
          ],
        },
        {
          model: Indicators,
          required: true,
          attributes: [
            ["code_indicator", "code"],
            ["name_indicator", "name"],
            ["content_indicator", "content"],
          ],
        },
        {
          model: Components,
          required: true,
          attributes: [
            ["code_component", "code"],
            ["name_component", "name"],
            ["content_component", "content"],
          ],
        },
        {
          model: Conditions,
          required: true,
          attributes: [
            ["code_condition", "code"],
            ["name_condition", "name"],
            ["content_condition", "content"],
          ],
        },
        {
          model: EvaluationModule,
          required: true,
          where: whereEvaluationModule,
        },
        {
          model: SurveyAccess,
          attributes: [],
          required: true,
          where: {
            user_id: userId,
          },
        },
      ],
      attributes: [
        [Sequelize.fn("HEX", Sequelize.col("code_survey")), "codeSurvey"],
        [
          Sequelize.fn(
            "concat",
            Sequelize.col("pre_code_survey"),
            " ",
            Sequelize.col("code_condition"),
            ".",
            Sequelize.col("code_component"),
            ".",
            Sequelize.col("code_indicator"),
            ".",
            Sequelize.col("code_means_verification")
          ),
          "codeSurvey2",
        ],
      ],
      where: whereSurvey,
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
    const totalPages = Math.ceil(count / limit);

    resolve({
      surveys: rows,
      totalRecords: count,
      totalPages,
      currentPage: page,
    });
  });

const getInfoSurvey = (code) =>
  new Promise(async (resolve, reject) => {
    try {
      const surveyInfo = await sequelize.query(
        "select s.id_survey,hex(s.code_survey) as codeSurvey,s.allowed_edit_survey as allowedEditSurvey,mv.*,i.*,comp.*,cond.*,em.*,ins.* from survey s  INNER JOIN means_verification mv on s.means_verification_id=mv.id_means_verification INNER JOIN institutes ins ON mv.institute_id=ins.id_institute INNER JOIN indicators i on s.indicator_id=i.id_indicator INNER JOIN components comp on s.component_id=comp.id_component INNER JOIN conditions cond on s.condition_id=cond.id_condition INNER JOIN evaluation_module em ON s.evaluation_module_id=em.id_evaluation_module WHERE s.code_survey=UNHEX(lower(:code))",
        {
          replacements: { code },
          type: QueryTypes.SELECT,
        }
      );

      if (!surveyInfo.length) {
        reject({
          code: 404,
          message: "Not found Survey",
        });
        return;
      }

      const { id_evaluation_module } = surveyInfo[0];

      let surveyItems = await Item.findAll({
        attributes: [
          ["id_item", "idItem"],
          ["name_item", "nameItem"],
          ["type_item", "typeItem"],
        ],
        include: [
          {
            model: SurveyItem,
            required: true,
            include: [
              {
                model: Survey,
                required: true,
                attributes: [
                  "id_survey",
                  [
                    Sequelize.fn("HEX", Sequelize.col("code_survey")),
                    "codeSurvey",
                  ],
                ],
                where: {
                  code_survey: Sequelize.fn("UNHEX", code),
                },
              },
            ],
          },
          {
            model: EvaluationModuleItem,
            required: true,
            where: {
              evaluation_module_id: id_evaluation_module,
            },
          },
        ],
      });

      let surveyTasks = await TaskGroup.findAll({
        attributes: [
          ["id_task_group", "idTaskGroup"],
          ["name_task_group", "nameGroup"],
          ["type_task_group", "typeGroup"],
        ],
        include: [
          {
            model: Tasks,
            required: true,
            include: [
              {
                model: Survey,
                required: true,
                attributes: [
                  "id_survey",
                  [
                    Sequelize.fn("HEX", Sequelize.col("code_survey")),
                    "codeSurvey",
                  ],
                ],
                where: {
                  code_survey: Sequelize.fn("UNHEX", code),
                },
              },
            ],
          },
        ],
      });

      if (!surveyItems.length) {
        surveyItems = await Item.findAll({
          attributes: [
            ["id_item", "idItem"],
            ["name_item", "nameItem"],
            ["type_item", "typeItem"],
          ],
          include: [
            {
              model: EvaluationModuleItem,
              required: true,
              where: {
                evaluation_module_id: id_evaluation_module,
              },
            },
          ],
        });
      }

      if (!surveyTasks.length) {
        surveyTasks = await TaskGroup.findAll({
          attributes: [
            ["id_task_group", "idTaskGroup"],
            ["name_task_group", "nameGroup"],
            ["type_task_group", "typeGroup"],
          ],
          include: [
            {
              model: EvaluationModuleTask,
              required: true,
              where: {
                evaluation_module_id: id_evaluation_module,
              },
            },
          ],
        });
      }

      const surveyInfoObject = surveyInfo[0];
      const propsMeansVerification = {
        code: surveyInfoObject.code_means_verification,
        name: surveyInfoObject.name_means_verification,
        content: surveyInfoObject.content_means_verification,
      };
      const propsIndicator = {
        code: surveyInfoObject.code_indicator,
        name: surveyInfoObject.name_indicator,
        content: surveyInfoObject.content_indicator,
      };

      const propsComponent = {
        code: surveyInfoObject.code_component,
        name: surveyInfoObject.name_component,
        content: surveyInfoObject.content_component,
      };

      const propsCondition = {
        code: surveyInfoObject.code_condition,
        name: surveyInfoObject.name_condition,
        content: surveyInfoObject.content_condition,
      };

      const propsModule = {
        code: surveyInfoObject.id_evaluation_module,
        name: surveyInfoObject.name_evaluation_module,
      };

      const propsInstitute = {
        name: surveyInfoObject.name_item_institute,
        content: surveyInfoObject.name_institute,
      };

      const meansVerification = new MeansVerificationDTO(
        propsMeansVerification
      );
      const indicator = new IndicatorDTO(propsIndicator);
      const component = new ComponentDTO(propsComponent);
      const condition = new ConditionDTO(propsCondition);
      const module = new ModuleDTO(propsModule);
      const institution = new InstituteDTO(propsInstitute);
      let taskList = null;
      let itemsList = null;

      if (surveyTasks.length > 0) {
        taskList = surveyTasks.map((taskGroup) => {
          const taskList = !taskGroup.tasks
            ? []
            : taskGroup.tasks.map((task) =>
                new TasksDTO({
                  id_task: task.id_task,
                  name_task: task.name_task,
                  status_task: task.status_task,
                }).properties()
              );

          return new GroupTaskDTO({
            idGroup: taskGroup.get("idTaskGroup"),
            nameGroup: taskGroup.get("nameGroup"),
            typeGroup: taskGroup.get("typeGroup"),
            tasks: taskList,
          }).properties();
        });
      }

      if (surveyItems.length > 0) {
        itemsList = surveyItems.map((item) => {
          const itemSurveyList = !item.survey_item
            ? []
            : item.survey_items.map(({ id_survey_item, value_survey_item }) => {
                return new SurveyItemDTO({
                  idSurveyItem: id_survey_item,
                  valueSurveyItem: value_survey_item,
                }).properties();
              });
          return new ItemDTO({
            idItem: item.get("idItem"),
            nameItem: item.get("nameItem"),
            typeItem: item.get("typeItem"),
            listItems: itemSurveyList ?? [],
          }).properties();
        });
      }

      const survey = new SurveyViewDTO({
        module,
        condition,
        component,
        indicator,
        meansVerification,
        task: taskList ?? [],
        items: itemsList ?? [],
        codeSurvey: surveyInfoObject.codeSurvey,
        allowedEdit: surveyInfoObject.allowedEditSurvey,
        institution,
      });

      resolve(survey.properties());
    } catch (error) {
      reject(error);
    }
  });

const findSurvey = (code) =>
  new Promise(async (resolve, reject) => {
    try {
      const surveyFound = await Survey.findOne({
        where: {
          code_survey: Sequelize.fn("UNHEX", code),
        },
      });

      if (!surveyFound) {
        reject({
          code: 404,
          message: "No se encontró la ficha",
        });
        return;
      }

      resolve(surveyFound.toJSON());
    } catch (error) {
      reject(error);
    }
  });

const updateSurvey = (surveyId, surveyObject, transaction) =>
  new Promise(async (resolve, reject) => {
    try {
      const surveyFound = await Survey.findByPk(surveyId);
      if (!surveyFound) {
        reject({ code: 404, message: "No se encontró la ficha" });
        return;
      }

      await surveyFound.update(surveyObject, { transaction });
      resolve();
    } catch (error) {
      reject(error);
    }
  });

const sumaryByEvaluationModule = (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const { module = null } = query;
      const whereEvaluationModule = {};

      if (module) {
        whereEvaluationModule[Op.or] = [
          {
            code_evaluation_module: module,
          },
        ];
      }

      const sumary = await Survey.findOne({
        attributes: [
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn("COUNT", Sequelize.literal("*")),
              0
            ),
            "total",
          ],
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  "CASE WHEN allowed_edit_survey=1 THEN 1 ELSE 0 END"
                )
              ),
              0
            ),
            "pendientes",
          ],
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  "CASE WHEN allowed_edit_survey=0 THEN 1 ELSE 0 END"
                )
              ),
              0
            ),
            "enviadas",
          ],
        ],
        include: [
          {
            model: EvaluationModule,
            required: true,
            attributes: [],
            where: whereEvaluationModule,
          },
        ],
        // where: whereEvaluationModule,
      });
      resolve(sumary);
    } catch (error) {
      reject(error);
    }
  });

const sumaryByEvaluationModuleToUser = (query, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const { module = null } = query;
      const whereEvaluationModule = {};

      if (module) {
        whereEvaluationModule[Op.or] = [
          {
            code_evaluation_module: module,
          },
        ];
      }

      const sumary = await Survey.findOne({
        attributes: [
          [Sequelize.fn("COALESCE", Sequelize.fn("COUNT", "*"), 0), "total"],
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  "CASE WHEN survey.allowed_edit_survey=1 THEN 1 ELSE 0 END"
                )
              ),
              0
            ),
            "pendientes",
          ],
          [
            Sequelize.fn(
              "COALESCE",
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  "CASE WHEN survey.allowed_edit_survey=0 THEN 1 ELSE 0 END"
                )
              ),
              0
            ),
            "enviadas",
          ],
        ],
        include: [
          {
            model: SurveyAccess,
            required: true,
            attributes: [],
            where: {
              user_id: userId,
            },
          },
          {
            model: EvaluationModule,
            required: true,
            attributes: [],
            where: whereEvaluationModule,
          },
        ],
        // where: whereEvaluationModule,
      });

      if (!sumary) {
        resolve({
          total: 0,
          pendientes: 0,
          enviados: 0,
        });
        return;
      }
      resolve(sumary);
    } catch (error) {
      reject(error);
    }
  });

const createSurvey = (surveyObject, transaction) =>
  new Promise(async (resolve, reject) => {
    try {
      await Survey.create(surveyObject, { transaction });
      resolve();
    } catch (error) {
      reject(error);
    }
  });

const createTaskSurvey = (tasks, surveyId, transaction) =>
  new Promise(async (resolve, reject) => {
    try {
      const dataSurveyTask = tasks.map(({ nameTask, taskGroupId }) => {
        return {
          name_task: nameTask,
          survey_id: surveyId,
          task_group_id: taskGroupId,
        };
      });

      await Tasks.bulkCreate(dataSurveyTask, { transaction });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
module.exports = {
  createSurvey,
  createTaskSurvey,
  getAllSurveys,
  getMySurveys,
  getInfoSurvey,
  findSurvey,
  updateSurvey,
  sumaryByEvaluationModule,
  sumaryByEvaluationModuleToUser,
};
