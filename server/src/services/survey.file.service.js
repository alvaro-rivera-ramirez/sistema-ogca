const SurveyFile=require("../models/SurveyFile");

const bulkCreateSurveyFile=(surveyId,files,transaction)=>new Promise(async(resolve, reject) => {
    try {
        const surveyFilesObject = files.map((file) => {
            return {
              survey_id: surveyId,
              name_survey_file: file.nameFile,
              dir_survey_file: file.dirFile,
            };
          });
          await SurveyFile.bulkCreate(surveyFilesObject, {
            transaction,
          });
          resolve();
    } catch (error) {
        reject(error);
    }
})

const getSurveyFile=(surveyId,dirFile)=>new Promise(async(resolve, reject) => {
  try {
    const fileFound=await SurveyFile.findOne({
      where:{
        survey_id:surveyId,
        dir_survey_file:dirFile
      }
    })

    if(!fileFound){
      reject({
        code:404,
        message:"No existe el archivo"
      })
      return;
    }
    resolve(fileFound.toJSON());
  } catch (error) {
    reject(error);
  }
});

module.exports={
    bulkCreateSurveyFile,
    getSurveyFile
}