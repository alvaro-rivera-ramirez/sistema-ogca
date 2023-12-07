const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");
const Survey=require("./Survey");
const TaskGroup=require("./TaskGroup");

const Tasks=sequelize.define("task",{
    id_task:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_task:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    status_task:{
        type:DataTypes.TINYINT(1),
        allowNull:true
    },
    isFulFilled:{
        type:DataTypes.TINYINT(1),
        allowNull:true
    }
},{
    timestamps:false,
    tableName:"tasks"
});

Survey.hasMany(Tasks,{
    foreignKey:"survey_id"
});

Tasks.belongsTo(Survey,{
    foreignKey:"survey_id"
});

TaskGroup.hasMany(Tasks,{
    foreignKey:"task_group_id"
})

Tasks.belongsTo(TaskGroup,{
    foreignKey:"task_group_id"
})

module.exports=Tasks;