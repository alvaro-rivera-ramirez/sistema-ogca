const EvaluationModuleItem = require("../models/EvaluationModuleItem");
const Item = require("../models/Item");
const SurveyItem=require("../models/SurveyItem");

const createItem = (itemObject, surveyId,evaluationModuleId, transaction) =>
  new Promise(async (resolve, reject) => {
    try {
      for (const item of itemObject) {
        const {type_item}=await searchItemToSurvey(item.idItem,evaluationModuleId);

        if(type_item==2){
          const listSurveyItem = item.itemList.map(({valueItem}) => {
            return {
              item_id: item.idItem,
              survey_id: surveyId,
              value_survey_item:valueItem
            };
          });
          await SurveyItem.bulkCreate(listSurveyItem, { transaction });
        }        
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
      const moduleItemFound=await EvaluationModuleItem.findOne({
        where:{
          evaluation_module_id:evaluationModuleId,
          item_id:itemId
        }
      });
  
      if(!moduleItemFound){
        reject({
          code:404,
          message:"El item no pertenece a la ficha"
        });
        return;
      }

      const itemFound=await Item.findByPk(itemId);
      if(!itemFound){
        reject({
          code:404,
          message:"El item no existe"
        });
        return;
      }

      resolve(itemFound.toJSON());
    } catch (error) {
      reject(error);
    }
  })
module.exports = {
  createItem,
};
