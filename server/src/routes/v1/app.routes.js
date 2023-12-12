const {Router}=require("express");
const router=Router();
const taskRouter=require("./task.routes");
const surveyRouter=require("./survey.routes");
const userRouter=require("./user.routes");
const indicatorRouter=require("./indicator.routes");
const componentRouter=require("./component.routes");
const conditionRouter=require("./condition.routes");
const instituteRouter=require("./institute.routes");
const sessionRouter=require("./session.routes");
const evaluationModuleRouter=require("./evaluation.module.routes");
const meansVerificationRouter=require("./means.verification.routes");

const {checkAuth}=require("../../middleware/auth.middleware");

router.use('/task',taskRouter);
router.use('/user',checkAuth,userRouter);
router.use('/survey',checkAuth,surveyRouter);
router.use('/indicator',checkAuth,indicatorRouter);
router.use('/component',checkAuth,componentRouter);
router.use('/condition',checkAuth,conditionRouter);
router.use('/institute',checkAuth,instituteRouter);
router.use('/evaluation-module',checkAuth,evaluationModuleRouter);
router.use('/mv',checkAuth,meansVerificationRouter);
router.use('/session',sessionRouter);

module.exports=router;