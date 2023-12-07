const {Router}=require("express")
const {getIndicators,getOneIndicator,createIndicator,updateIndicator}=require("../../controllers/indicator.controller")
const indicatorRouter=Router()

indicatorRouter.get('/',getIndicators)
.get('/:indicatorId',getOneIndicator)
.post('/',createIndicator)
.put('/:indicatorId',updateIndicator);

module.exports=indicatorRouter