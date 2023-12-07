const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TaskGroup=sequelize.define("task_group",{
    id_task_group:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_task_group:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    type_task_group:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    timestamps:false,
    tableName:"task_group"
});


module.exports=TaskGroup;