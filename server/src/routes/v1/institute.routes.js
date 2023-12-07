const {Router}=require("express")
const {createInstitute, getInstitute}=require("../../controllers/institute.controller")
const instituteRouter=Router()

instituteRouter.get('/',getInstitute)
.post('/', createInstitute);

module.exports=instituteRouter