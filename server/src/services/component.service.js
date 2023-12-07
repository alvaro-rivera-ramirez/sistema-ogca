const { Op } = require("sequelize");
const Components = require("../models/Components");

const getAllComponents = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { page = 1, limit = 10, search } = query;

      const whereComponent = {};

      if (search) {
        whereComponent[Op.or] = [
          Sequelize.where(
            Sequelize.col("content_component"),
            "LIKE",
            `%${search}%`
          ),
        ];
      }
      const offset = (page - 1) * limit;

      const { count, rows } = await Components.findAndCountAll({
        where: whereComponent,
        offset: parseInt(offset),
        limit: parseInt(limit),
      });

      const totalPages = Math.ceil(count / limit);

      const rowsMap = rows.map((component) => {
        return {
          id: component.id_component,
          content: component.content_component,
        };
      });
      resolve({
        component: rowsMap,
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
  getAllComponents,
};
