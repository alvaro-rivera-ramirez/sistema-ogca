const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const EvaluationModule = sequelize.define(
  "evaluation_module",
  {
    id_evaluation_module:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    name_evaluation_module:{
      type:DataTypes.STRING,
      allowNull:false
    },
    code_evaluation_module:{
      type:DataTypes.STRING(15),
      allowNull:false,
      unique:true
    },
    dir_attached_file:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    desc_attached_file:{
      type:DataTypes.TEXT,
      allowNull:false,
      unique:true
    },
    dir_file_module:{
      type:DataTypes.STRING(100),
      allowNull:false,
      unique:true
    },

  },
  {
    timestamps: false,
    tableName:"evaluation_module"
  }
);

module.exports=EvaluationModule;