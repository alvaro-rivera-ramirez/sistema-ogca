const path = require("path");
const fs = require("fs");
const sequelize = require("../config/database");
const SurveyService = require("../services/survey.service");
const SurveyFileService = require("../services/survey.file.service");
const TaskService = require("../services/task.service");
const ItemService = require("../services/item.service");
const {
  handleErrorResponse,
  handleHttpError,
} = require("../middleware/handle.error.middleware");
const {
  searchUserAccessSurvey,
  bulkCreateAccess,
} = require("../services/survey.access.service");
const { uploadFile } = require("../utils/upload.file.utils");
const PATH_FILES_PRIVATE = path.join(__dirname, "../../uploads/private");

const getAllSurveys = async (req, res) => {
  try {
    const { role, iduser, query } = req;
    let surveys = {};
    if (![1, 2].includes(role)) {
      surveys = await SurveyService.getMySurveys(query, iduser);
    } else {
      surveys = await SurveyService.getAllSurveys(query);
    }

    res.json(surveys);
  } catch (error) {
    handleHttpError(res, error);
  }
};

const createSurvey = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      moduleId,
      meansVerificationId,
      preCodeSurvey,
      tasks = [],
      items = [],
      expDateTime,
    } = req.body;
    const surveyObject = {
      evaluation_module_id: moduleId,
      means_verification_id: meansVerificationId,
      exp_datetime_survey: expDateTime,
      pre_code_survey: preCodeSurvey,
    };
    const surveyCreated = await SurveyService.createSurvey(
      surveyObject,
      transaction
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleHttpError(res, error);
  }
};

const getInfoSurvey = async (req, res) => {
  try {
    const { code } = req.params;
    const InfoSurvey = await SurveyService.getInfoSurvey(code);
    res.json(InfoSurvey);
  } catch (error) {
    if (typeof error.code == "number") {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleHttpError(res, error);
  }
};

const saveSurvey = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { task, items = [] } = req.body;
    const { code } = req.params;

    const { id_survey, evaluation_module_id } = await SurveyService.findSurvey(
      code
    );

    await TaskService.updateStatus(
      task,
      id_survey,
      evaluation_module_id,
      transaction
    );
    await ItemService.createItem(
      items,
      id_survey,
      evaluation_module_id,
      transaction
    );
    await SurveyService.updateSurvey(
      id_survey,
      { allowed_edit_survey: 0 },
      transaction
    );
    await transaction.commit();
    res.send("Ficha Enviada");
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
};
const saveFilesSurvey = async (req, res) => {
  let filesUploaded = [];
  const transaction = await sequelize.transaction();
  try {
    const { files = null } = req;
    const { code } = req.params;
    const { id_survey } = await SurveyService.findSurvey(code);

    if (files && files["attached"]) {
      const filesUpload = Array.from(files["attached"]);
      for (const file of filesUpload) {
        const { dirFile, nameFile } = await uploadFile(
          file,
          "private",
          "file-survey",
          ["jpg", "jpeg", "png", "pdf", "docx", "xls", "xlsx"]
        );
        filesUploaded.push({
          dirFile,
          nameFile,
        });
      }
    }

    await SurveyFileService.bulkCreateSurveyFile(
      id_survey,
      filesUploaded,
      transaction
    );
    await transaction.commit();
    res.send("Archivos guardados");
  } catch (error) {
    await transaction.rollback();

    filesUploaded.forEach(({ dirFile }) => {
      fs.unlinkSync(path.join(PATH_FILES_PRIVATE, dirFile));
    });
    if (typeof error.code == "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
};

const getSurveyToUsers = async (req, res) => {
  try {
    const { code } = req.params;
    const { id_survey } = await SurveyService.findSurvey(code);
    console.log(id_survey);
    const userSurveyFound = await searchUserAccessSurvey(id_survey);
    res.send(userSurveyFound);
  } catch (error) {
    if (typeof error.code == "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
};

const createAccesUserSurvey = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { code } = req.params;
    const { users = [] } = req.body;

    const { id_survey } = await SurveyService.findSurvey(code);
    await bulkCreateAccess(users, id_survey, transaction);
    await transaction.commit();
    res.sendStatus(201);
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
};

const getSummaryToSurvey = async (req, res) => {
  try {
    const { role, iduser, query } = req;

    let sumary = {};
    if (![1, 2].includes(role)) {
      sumary = await SurveyService.sumaryByEvaluationModuleToUser(
        query,
        iduser
      );
    } else {
      sumary = await SurveyService.sumaryByEvaluationModule(query);
    }
    res.send(sumary);
  } catch (error) {
    handleHttpError(res, error);
  }
};

const updateStatusSurvey = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { status } = req.body;
    const { code } = req.params;
    const { id_survey } = await SurveyService.findSurvey(code);
    await SurveyService.updateSurvey(
      id_survey,
      { status_survey: status },
      transaction
    );

    await transaction.commit();
    res.sendStatus(204);
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
};

const uploadedFilesSurvey = async (req, res) => {
  try {
    const {codeFile}=req.params;
    const {surveyId}=req;
    const rutaArchivo = path.join(PATH_FILES_PRIVATE, 'file-survey', codeFile);

    const {name_survey_file}=await SurveyFileService.getSurveyFile(surveyId,`file-survey/${codeFile}`);
  if (fs.existsSync(rutaArchivo)) {
    res.setHeader('Content-Disposition', `attachment; filename=${name_survey_file || codeFile}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    res.sendFile(rutaArchivo);
  } else {
    res.status(404).send({
      message:"El archivo no existe"
    });
  }
  } catch (error) {
    handleHttpError(res,error)
  }
};

module.exports = {
  getAllSurveys,
  getInfoSurvey,
  uploadedFilesSurvey,
  saveSurvey,
  saveFilesSurvey,
  createAccesUserSurvey,
  getSurveyToUsers,
  getSummaryToSurvey,
  updateStatusSurvey,
};
