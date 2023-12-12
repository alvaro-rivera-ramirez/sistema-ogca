const { Router } = require("express");
const fileUpload=require("express-fileupload");
const {
  getAllSurveys,
  getInfoSurvey,
  saveSurvey,
  createAccesUserSurvey,
  getSurveyToUsers,
  getSummaryToSurvey,
  updateStatusSurvey,
  saveFilesSurvey,
  uploadedFilesSurvey,
} = require("../../controllers/survey.controller");
const {
  validateSurveyAvailable, validateAccessSurvey,
} = require("../../middleware/validate.record.middleware");
const { checkRole } = require("../../middleware/auth.middleware");
const { validateFileOptional } = require("../../middleware/validate.file.middleware");

const surveyRouter = Router();
surveyRouter.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

surveyRouter.get("/:code/info", getInfoSurvey);
surveyRouter.post("/:code/info",validateAccessSurvey,validateSurveyAvailable, saveSurvey);
surveyRouter.get("/:code/file/:codeFile",validateAccessSurvey,uploadedFilesSurvey);
surveyRouter.post("/:code/file",validateAccessSurvey,validateFileOptional("attached",["jpg","jpeg","png","pdf","docx","xls","xlsx"]), saveFilesSurvey);
surveyRouter.patch("/:code/status", checkRole([1, 2]), updateStatusSurvey);
surveyRouter.get("/:code/users", checkRole([1, 2]), getSurveyToUsers);
surveyRouter.post("/:code/users", checkRole([1, 2]), createAccesUserSurvey);
surveyRouter.get("/", getAllSurveys);
surveyRouter.get("/summary", getSummaryToSurvey);

module.exports = surveyRouter;