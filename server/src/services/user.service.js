const { Sequelize, Op, QueryTypes, where } = require("sequelize");
const Users = require("../models/Users");
const UserDTO = require("../dto/user.dto");
const Roles = require("../models/Roles");
const SurveyAccess = require("../models/SurveyAccess");
const {encrypt} = require("../utils/password.utils");

const getInfoRoleUserByCode = (code) =>
  new Promise(async (resolve, reject) => {
    try {
      const userFound = await Users.findOne({
        where: {
          code_user: code,
        },
        include: [
          {
            model: Roles,
            required: true,
          },
        ],
      });

      if (!userFound) {
        reject({
          code: 404,
          message: "El usuario no existe",
        });
        return;
      }

      resolve(userFound.toJSON());
    } catch (error) {
      reject(error);
    }
  });

const findUserByEmail = (email) =>
  new Promise(async (resolve, reject) => {
    try {
      const userFound = await Users.findOne({
        where: {
          email_user: email,
        },
      });

      if (!userFound) {
        reject({
          code: 404,
          message: "El usuario no existe",
        });
        return;
      }

      resolve(userFound.toJSON());
    } catch (error) {
      reject(error);
    }
  });

const createUser = (userObject, transaction) =>
  new Promise(async (resolve, reject) => {
    try {

      console.log(userObject);
      const hashedPassword = await encrypt(userObject.dni_user.toString());
      userObject.password_user = hashedPassword;

      const userCreated = await Users.create(userObject, { transaction });
      return resolve(userCreated);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return reject({
          code: 409,
          message: "El dni o email ya fue utilizado",
        });
      }
      return reject(error);
    }
  });


const getAllUsers = (query) =>
  new Promise(async (resolve, reject) => {
    const { search = "", page = 1, limit = 8 } = query;

    const whereUsers = {};

    if (search) {
      whereUsers[Op.or] = [
        Sequelize.where(Sequelize.col("name_user"), "LIKE", `%${search}%`),
        Sequelize.where(Sequelize.col("lastname_user"), "LIKE", `%${search}%`),
        Sequelize.where(Sequelize.col("email_user"), "LIKE", `%${search}%`),
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Users.findAndCountAll({
      attributes: [
        ["id_user", "userId"],
        ["name_user", "nameUser"],
        ["lastname_user", "lastnameUser"],
        ["email_user", "emailUser"],
        ["role_id", "roleId"],
      ],
      where: whereUsers,
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
    const totalPages = Math.ceil(count / limit);

    resolve({
      users: rows,
      totalRecords: count,
      totalPages,
      currentPage: page,
    })})

const getAllUsersWithOutAccessToSurvey = (query, surveyId) =>
  new Promise(async (resolve, reject) => {
    const { search = "", page = 1, limit = 8 } = query;

    const whereUsers = {};

    if (search) {
      whereUsers[Op.or] = [
        Sequelize.where(Sequelize.col("name_user"), "LIKE", `%${search}%`),
        Sequelize.where(Sequelize.col("lastname_user"), "LIKE", `%${search}%`),
        Sequelize.where(Sequelize.col("email_user"), "LIKE", `%${search}%`),
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Users.findAndCountAll({
      attributes: [
        ["id_user", "userId"],
        ["name_user", "nameUser"],
        ["lastname_user", "lastnameUser"],
        ["email_user", "emailUser"],
        ["role_id", "roleId"],
      ],
      where: {
        [Op.and]: [
          Sequelize.literal(`
        NOT EXISTS (
          SELECT 1
          FROM survey_access AS sa
          WHERE id_user = sa.user_id
          AND sa.survey_id = ${surveyId}
        )
      `),
          { role_id: 3 },
          whereUsers,
        ],
      },
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
    const totalPages = Math.ceil(count / limit);

    resolve({
      users: rows,
      totalRecords: count,
      totalPages,
      currentPage: page,
    });
  });

module.exports = {
  getInfoRoleUserByCode,
  createUser,
  findUserByEmail,
  getAllUsers,
  getAllUsersWithOutAccessToSurvey
};
