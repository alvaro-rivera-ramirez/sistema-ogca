const {Router}=require("express");
const router=Router();
const routersV1=require("./v1/app.routes");

router.use('/v1',routersV1);
module.exports=router;