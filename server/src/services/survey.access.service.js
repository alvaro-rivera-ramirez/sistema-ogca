const SurveyAccess=require("../models/SurveyAccess");
const Users = require("../models/Users");

const bulkCreateAccess=(users,surveyId,transaction)=>new Promise(async(resolve, reject) => {
    try {
        const dataUsers=users.map((u)=>{
            return {
                survey_id:surveyId,
                user_id:u.userId
            }
        })
        
        await SurveyAccess.bulkCreate(dataUsers,{transaction});

        resolve();
    } catch (error) {
        console.log(error)
        reject({
            code:400,
            message:"Error al actualizar el acceso a la ficha"
        });
    }
})

const searchUserAccessSurvey=(surveyId)=>new Promise(async(resolve, reject) => {
    try {
        const userAccess=await SurveyAccess.findAll({
            where:{
                survey_id:surveyId
            },
            include:[
                {
                    model:Users,
                    required:true,
                    attributes:[["id_user","userId"],["name_user","nameUser"],["lastname_user","lastnameUser"],["email_user","emailUser"]],
                    where:{
                        role_id:3
                    }
                }
            ]
        });

        resolve(userAccess)
    } catch (error) {
        reject(error);
    }
})



module.exports={
    bulkCreateAccess,
    searchUserAccessSurvey
}