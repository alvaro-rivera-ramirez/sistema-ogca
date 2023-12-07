const sequelize=require("../config/database");
const {nanoid} = require("nanoid")
const UserService = require("../services/user.service");
const {findSurvey}=require("../services/survey.service");
const {handleErrorResponse,handleHttpError}=require("../middleware/handle.error.middleware");
const createUser = async(req,res) => {
  const transaction=await sequelize.transaction();
  try {
    const {name,lastname,email,dni,phone,password,role, institute}=req.body;
    const userObject={
      name_user:name,lastname_user:lastname,email_user:email,dni_user:dni,phone_user:phone,password_user:password,code_user:nanoid(15),role_id:role, institute_id:institute,
    }
    console.log(userObject)
    await UserService.createUser(userObject,transaction);
    await transaction.commit();
    res.send("usuario creado");
  } catch (error) {
    await transaction.rollback();
    if(error.code){
        return handleErrorResponse(res,error.message,error.code);
    }
    return handleHttpError(res,error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userList = await UserService.getAllUsers(req.query);
    res.json(userList);
  } catch (error) {
    handleHttpError(res, error);
  }
};

const getAllUserWithOutAccessSurvey=async(req,res)=>{
  try {
    const { codeSurvey} = req.params;

    const {id_survey}=await findSurvey(codeSurvey);
    const userList = await UserService.getAllUsersWithOutAccessToSurvey(req.query,id_survey);
    res.json(userList);
  } catch (error) {
    handleErrorResponse(res,error)
  }
}
module.exports = {
  createUser,
  getAllUsers,
  getAllUserWithOutAccessSurvey
};
