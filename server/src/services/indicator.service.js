const { Op, Sequelize } = require("sequelize");
const Indicator = require("../models/Indicators");

const getAllIndicator = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { page = 1, limit = 10, search } = query;

      const whereIndicator = {};

      if (search) {
        whereIndicator[Op.or] = [
          Sequelize.where(
            Sequelize.col("content_indicator"),
            "LIKE",
            `%${search}%`
          ),
        ];
      }
      const offset = (page - 1) * limit;

      const { count, rows } = await Indicator.findAndCountAll({
        where: whereIndicator,
        offset: parseInt(offset),
        limit: parseInt(limit),
      });

      const totalPages = Math.ceil(count / limit);

      const rowsMap = rows.map((indicator) => {
        return {
          id: indicator.id_indicator,
          content: indicator.content_indicator,
        };
      });
      resolve({
        indicator: rowsMap,
        totalRecords: count,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const findIndicator=(indicatorId)=>new Promise(async(resolve, reject) => {
  try {
    const indicatorFound=await Indicator.findByPk(indicatorId);

    if(!indicatorFound){
      reject({
        code:404,
        message:"El indicador no existe"
      });
      return;
    }
 
    resolve({
      id:indicatorFound.id_indicator,
      content:indicatorFound.content_indicator,
      name:indicatorFound.name_indicator
    });
  } catch (error) {
    reject(error)
  }
})
const createIndicator=(dataIndicator,transaction)=> new Promise(async(resolve, reject) => {
  try {
    await Indicator.create(dataIndicator,{transaction});
    resolve();
  } catch (error) {
    reject(error)
  }
})

const updateIndicator=(indicatorId,dataIndicator,transaction)=>new Promise(async(resolve, reject) => {
  try {
    const indicatorFound=await Indicator.findByPk(indicatorId);
    await indicatorFound.update(dataIndicator,{transaction});
    resolve();
  } catch (error) {
    reject(error)
  }
})

const deleteIndicator=(indicatorId,transaction)=>new Promise(async(resolve, reject) => {
  try {
    await Indicator.destroy({
      where: {
        id_indicator: indicatorId
      },
      force: true
    },{transaction});
    resolve()
  } catch (error) {
    reject(error)
  }
})

module.exports = {
  getAllIndicator,
  createIndicator,
  findIndicator,
  updateIndicator,
  deleteIndicator
};
