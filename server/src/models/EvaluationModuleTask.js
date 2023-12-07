const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const EvaluationModule = require("./EvaluationModule");
const TaskGroup = require("./TaskGroup");

const EvaluationModuleTask = sequelize.define(
  "evaluation_module_task",
  {
    id_evaluation_module_task: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
    tableName: "evaluation_module_task",
    indexes: [
      {
        unique: true,
        fields: ["evaluation_module_id","task_group_id"],
        name: "evaluationModuleTask",
      },
    ],
  }
);

EvaluationModule.hasMany(EvaluationModuleTask, {
  foreignKey: "evaluation_module_id"
});

EvaluationModuleTask.belongsTo(EvaluationModule, {
    foreignKey: "evaluation_module_id"
});

TaskGroup.hasMany(EvaluationModuleTask, {
  foreignKey: "task_group_id",
});

EvaluationModuleTask.belongsTo(TaskGroup, {
  foreignKey: "task_group_id",
});
module.exports = EvaluationModuleTask;