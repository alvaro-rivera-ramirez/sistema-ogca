const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Users = require("./Users");
const Survey = require("./Survey");

const SurveyAccess = sequelize.define(
  "survey_access",
  {
    survey_access_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
    tableName: "survey_access",
    indexes: [
      {
        unique: true,
        fields: ["user_id","survey_id"],
        name: "user_survey",
      },
    ],
  }
);

Users.hasMany(SurveyAccess, {
  foreignKey: "user_id",
});

SurveyAccess.belongsTo(Users, {
  foreignKey: "user_id",
});

Survey.hasMany(SurveyAccess, {
  foreignKey: "survey_id",
});

SurveyAccess.belongsTo(Survey, {
  foreignKey: "survey_id",
});
module.exports = SurveyAccess;
