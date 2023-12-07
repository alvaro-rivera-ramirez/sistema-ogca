const MeansVerification=require("../models/MeansVerification");


// const findIndicator=(indicatorId)=>new Promise(async(resolve, reject) => {
//     try {
//       const indicatorFound=await Indicator.findByPk(indicatorId);
  
//       if(!indicatorFound){
//         reject({
//           code:404,
//           message:"El indicador no existe"
//         });
//         return;
//       }
   
//       resolve({
//         id:indicatorFound.id_indicator,
//         content:indicatorFound.content_indicator
//       });
//     } catch (error) {
//       reject(error)
//     }
//   })
//   const createIndicator=(dataIndicator,transaction)=> new Promise(async(resolve, reject) => {
//     try {
//       await Indicator.create(dataIndicator,{transaction});
//       resolve();
//     } catch (error) {
//       reject(error)
//     }
//   })
  
//   const updateIndicator=(indicatorId,dataIndicator,transaction)=>new Promise(async(resolve, reject) => {
//     try {
//       const indicatorFound=await Indicator.findByPk(indicatorId);
//       await indicatorFound.update(dataIndicator).save({transaction});
//       resolve();
//     } catch (error) {
//       reject(error)
//     }
//   })
  
//   const deleteIndicator=(indicatorId,transaction)=>new Promise(async(resolve, reject) => {
//     try {
//       await Indicator.destroy({
//         where: {
//           id_indicator: indicatorId
//         },
//         force: true
//       },{transaction});
//       resolve()
//     } catch (error) {
//       reject(error)
//     }
//   })
  