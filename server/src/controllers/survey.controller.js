const sequelize=require("../config/database");
const SurveyService = require("../services/survey.service");
const TaskService=require("../services/task.service");
const ItemService=require("../services/item.service");
const {
  handleErrorResponse,
  handleHttpError,
} = require("../middleware/handle.error.middleware");
const { searchUserAccessSurvey, bulkCreateAccess } = require("../services/survey.access.service");

const getAllSurveys = async (req, res) => {
  try {
    const {role,iduser,query}=req;
    let surveys={};
    if(![1,2].includes(role)){
      surveys=await SurveyService.getMySurveys(query,iduser);
    }else{
      surveys = await SurveyService.getAllSurveys(query);
    }

    res.json(surveys);
  } catch (error) {
    handleHttpError(res, error);
  }
};

const createSurvey = async(req,res) => {
  const transaction=await sequelize.transaction();
  try {
    const {moduleId,meansVerificationId,preCodeSurvey,tasks=[],items=[],expDateTime}=req.body;
    const surveyObject={
      evaluation_module_id:moduleId,
      means_verification_id:meansVerificationId,
      exp_datetime_survey:expDateTime,
      pre_code_survey:preCodeSurvey
    }
    const surveyCreated=await SurveyService.createSurvey(surveyObject,transaction);

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

const saveSurvey=async(req,res)=>{
  const transaction=await sequelize.transaction();
    try {
        const {task,items=[]}=req.body;
        const { code } = req.params;
        const {id_survey,evaluation_module_id}=await SurveyService.findSurvey(code);

        await TaskService.updateStatus(task,id_survey,evaluation_module_id,transaction);
        await ItemService.createItem(items,id_survey,evaluation_module_id,transaction);
        await SurveyService.updateSurvey(id_survey,{allowed_edit_survey:0},transaction);
        await transaction.commit();
        res.send("Ficha Enviada")
    } catch (error) {
        await transaction.rollback();
        if(typeof error.code=="number"){
            handleErrorResponse(res,error.message,error.code)
            return;
        }
        handleHttpError(res,error);
    }
}

const getSurveyToUsers=async(req,res)=>{
  try {
    const { code } = req.params;
    const {id_survey}=await SurveyService.findSurvey(code);
    console.log(id_survey)
    const userSurveyFound=await searchUserAccessSurvey(id_survey);
    res.send(userSurveyFound);
    
  } catch (error) {
    if(typeof error.code=="number"){
      handleErrorResponse(res,error.message,error.code)
      return;
    }
    handleHttpError(res,error); 
  }
}

const createAccesUserSurvey=async(req,res)=>{
  const transaction=await sequelize.transaction();
  try {
    const { code } = req.params;
    const {users=[]}=req.body;

    const {id_survey}=await SurveyService.findSurvey(code);
    await bulkCreateAccess(users,id_survey,transaction)
    await transaction.commit();
    res.sendStatus(201);
  } catch (error) {
    await transaction.rollback();
    if(typeof error.code=="number"){
      handleErrorResponse(res,error.message,error.code)
      return;
    }
    handleHttpError(res,error); 
  }
}

const getSummaryToSurvey=async(req,res)=>{
  try {
    const {role,iduser,query}=req;

    let sumary={};
    if(![1,2].includes(role)){
      sumary=await SurveyService.sumaryByEvaluationModuleToUser(query,iduser);
    }else{
      sumary=await SurveyService.sumaryByEvaluationModule(query);
    }
    res.send(sumary);

  } catch (error) {
    handleHttpError(res,error);
  }
}
module.exports = {
  getAllSurveys,
  getInfoSurvey,
  saveSurvey,
  createAccesUserSurvey,
  getSurveyToUsers,
  getSummaryToSurvey
};
