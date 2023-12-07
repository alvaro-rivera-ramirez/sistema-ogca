const { Sequelize, Op, QueryTypes, where } = require("sequelize");
const Institutes = require("../models/Institutes");

const getAllInstitute = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(Object.keys(query).length==0){
        const institutes=await Institutes.findAll();
        resolve({
          institutes
        })
        return;
      }
      
      const { search = "", page = 1, limit = 5 } = query;

      const whereSearch = {};

      if (search) {
        whereSearch[Op.or] = [
          {
            name_institute: { [Op.like]: `%${search}%` },
          },
        ];
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await Institutes.findAndCountAll({
        where: whereSearch,
        offset: parseInt(offset),
        limit: parseInt(limit),
      });

      const totalPages = Math.ceil(count / limit);

      resolve({
        institutes: rows,
        totalRecords: count,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createInstitute = async (instituteObject, transaction) => {
    try {
      const instituteCreated = await Institutes.create(instituteObject, { transaction });
      return instituteCreated;
    } catch (error) {
      // Manejar el error, por ejemplo, loguearlo o lanzar una excepción personalizada
      throw error;
    }
  };

module.exports = {
  getAllInstitute,
  createInstitute
};