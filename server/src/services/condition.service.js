const { Op,Sequelize } = require("sequelize");
const Conditions = require("../models/Conditions");

const getAllConditions=(query)=>{
    return new Promise(async(resolve, reject) => {
        try {
            const { page = 1, limit = 10, search } = query;

            const whereCondition = {};
      
            if (search) {
              whereCondition[Op.or] = [
                Sequelize.where(
                  Sequelize.col("content_condition"),
                  "LIKE",
                  `%${search}%`
                ),
              ];
            }
            const offset = (page - 1) * limit;
      
            const { count, rows } = await Conditions.findAndCountAll({
              where: whereCondition,
              offset: parseInt(offset),
              limit: parseInt(limit),
            });
      
            const totalPages = Math.ceil(count / limit);
      
            const rowsMap = rows.map((condition) => {
              return {
                id: condition.id_condition,
                content: condition.content_condition,
              };
            });
            resolve({
              condition: rowsMap,
              totalRecords: count,
              totalPages,
              currentPage: page,
            });
        } catch (error) {
            reject(error);
        }
    })
}

module.exports={
    getAllConditions
}