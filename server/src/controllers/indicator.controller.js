const sequelize = require("../config/database");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../middleware/handle.error.middleware");
const IndicatorService = require("../services/indicator.service");

const getIndicators = async (req, res) => {
  try {
    const indicators = await IndicatorService.getAllIndicator(req.query);
    res.json(indicators);
  } catch (error) {
    if (typeof error.code == "number") {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleHttpError(res, error);
  }
};

const getOneIndicator = async (req, res) => {
  try {
    const {indicatorId}=req.params;
    const indicatorFound=await IndicatorService.findIndicator(indicatorId);
    res.json(indicatorFound);
  } catch (error) {
    if (typeof error.code == "number") {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleHttpError(res, error);
  }
};

const createIndicator=async(req,res)=>{
    const transaction=await sequelize.transaction();
    try {
        const {content}=req.body;
        const dataIndicator={
            content_indicator:content,
            name_indicator:"Indicador"
        }
        await IndicatorService.createIndicator(dataIndicator,transaction);
        await transaction.commit();
        res.sendStatus(201);
    } catch (error) {
        await transaction.rollback();
        if (typeof error.code == "number") {
            return handleErrorResponse(res, error.message, error.code);
          }
          return handleHttpError(res, error);
    }
}

const updateIndicator=async(req,res)=>{
    const transaction=await sequelize.transaction();
    try {
        const {content}=req.body;
        const {indicatorId}=req.params;

        const dataIndicator={
            content_indicator:content
        }
        await IndicatorService.updateIndicator(indicatorId,dataIndicator,transaction);

        await transaction.commit();
        res.sendStatus(204)
    } catch (error) {
        await transaction.rollback();
        if (typeof error.code == "number") {
            return handleErrorResponse(res, error.message, error.code);
          }
          return handleHttpError(res, error);
    }
}
module.exports = {
  getIndicators,
  getOneIndicator,
  createIndicator,
  updateIndicator
};
