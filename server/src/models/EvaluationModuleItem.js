const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const EvaluationModule = require("./EvaluationModule");
const Item = require("./Item");

const EvaluationModuleItem = sequelize.define(
  "evaluation_module_item",
  {
    id_evaluation_module_item: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    list_item:{
      type:DataTypes.JSON,
      allowNull:false
    },
    columns_item:{
      type:DataTypes.JSON,
      allowNull:false
    },
    columns_group:{
      type:DataTypes.JSON,
      allowNull:false
    }
  },
  {
    timestamps: false,
    tableName: "evaluation_module_item",
    indexes: [
      {
        unique: true,
        fields: ["evaluation_module_id","item_id"],
        name: "evaluationModuleItem",
      },
    ],
  }
);

EvaluationModule.hasMany(EvaluationModuleItem, {
  foreignKey: "evaluation_module_id"
});

EvaluationModuleItem.belongsTo(EvaluationModule, {
    foreignKey: "evaluation_module_id"
});

Item.hasMany(EvaluationModuleItem, {
  foreignKey: "item_id",
});

EvaluationModuleItem.belongsTo(Item, {
  foreignKey: "item_id",
});
module.exports = EvaluationModuleItem;