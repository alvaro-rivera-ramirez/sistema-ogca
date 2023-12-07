const SurveyAccess=require("../models/SurveyAccess");
const Survey=require("../models/Survey");
const EvaluationModule = require("../models/EvaluationModule");

const getAllModules=()=>new Promise(async(resolve, reject) => {
   try {
    const result= await EvaluationModule.findAll();

    resolve(result)
   } catch (error) {
    reject(error)
   } 
});

const getAllModuleByUserAccess=(userId)=>new Promise(async(resolve, reject) => {
    try {
        const result= await EvaluationModule.findAll({
            include: [
              {
                model: Survey,
                required:true,
                attributes: [],
                include: [
                  {
                    model: SurveyAccess,
                    required:true,
                    attributes: [],
                    where: {
                      user_id: userId,
                    },
                  },
                ],
              },
            ],
            raw: true,
            group: ['id_evaluation_module'],
          });

          resolve(result);
    } catch (error) {
        reject(error)
    }
})

module.exports={
    getAllModules,
    getAllModuleByUserAccess
}