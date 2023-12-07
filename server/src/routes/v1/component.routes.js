const {Router}=require("express")
const {getComponents}=require("../../controllers/component.controller")
const componentRouter=Router()

componentRouter.get('/',getComponents);

module.exports=componentRouter