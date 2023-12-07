const EvaluationModuleItem = require("../models/EvaluationModuleItem");
const SurveyItem=require("../models/SurveyItem");

const createItem = (itemObject, surveyId,evaluationModuleId, transaction) =>
  new Promise(async (resolve, reject) => {
    try {
      for (const item of itemObject) {
        await searchItemToSurvey(item.idItem,evaluationModuleId);
        const listSurveyItem = item.listItems.map(({rows=[],valueRecord}) => {
          return {
            item_id: item.idItem,
            survey_id: surveyId,
            value_item: JSON.stringify({
              rows,
              valueRecord
            }),
          };
        });
        await SurveyItem.bulkCreate(listSurveyItem, { transaction });
      }
      resolve();
    } catch (error) {
      console.log(error);
      reject({
        code: 400,
        message: "Error al guardar los item de la encuesta",
      });
    }
  });

  const searchItemToSurvey=(itemId,evaluationModuleId)=>new Promise(async(resolve, reject) => {
    try {
      const itemFound=await EvaluationModuleItem.findOne({
        where:{
          evaluation_module_id:evaluationModuleId,
          item_id:itemId
        }
      });
  
      if(!itemFound){
        reject({
          code:404,
          message:"El item no existe en la ficha"
        });
        return;
      }
      resolve(itemFound);
    } catch (error) {
      reject(error);
    }
  })
module.exports = {
  createItem,
};
