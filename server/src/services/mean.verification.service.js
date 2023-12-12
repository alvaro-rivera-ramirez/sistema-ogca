const { Op , Sequelize} = require("sequelize");
const MeansVerification = require("../models/MeansVerification");

const getAll = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { page = 1, limit = 10, search="" } = query;

      const whereMeanVerification = {};

      if (search) {
        whereMeanVerification[Op.or] = [
          Sequelize.where(
            Sequelize.col("content_means_verification"),
            "LIKE",
            `%${search}%`
          ),
        ];
      }
      const offset = (page - 1) * limit;

      const { count, rows } = await MeansVerification.findAndCountAll({
        where: whereMeanVerification,
        offset: parseInt(offset),
        limit: parseInt(limit),
      });

      const totalPages = Math.ceil(count / limit);

      const rowsMap = rows.map((mv) => {
        return {
          id: mv.id_means_verification,
          content: mv.content_means_verification,
        };
      });
      resolve({
        rowsData: rowsMap,
        totalRecords: count,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAll,
};
