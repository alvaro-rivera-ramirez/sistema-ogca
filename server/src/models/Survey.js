const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");
const MeansVerification=require("./MeansVerification");
const Conditions=require("./Conditions");
const Components=require("./Components");
const Indicators=require("./Indicators");
const EvaluationModule=require("./EvaluationModule");
const Survey=sequelize.define("survey",{
    id_survey:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    create_datetime_survey:{
        type:DataTypes.DATE,
        allowNull:true
    },
    exp_datetime_survey:{
        type:DataTypes.DATE,
        allowNull:false
    },
    code_survey:{
        type:DataTypes.BLOB(16),
        allowNull:false
    },
    allowed_edit_survey:{
        type:DataTypes.TINYINT(1),
        allowNull:false,
        defaultValue:1
    }
},{
    timestamps:false,
    tableName:"survey"
});

MeansVerification.hasMany(Survey,{
    foreignKey:"means_verification_id"
});

Survey.belongsTo(MeansVerification,{
    foreignKey:"means_verification_id"
});

Indicators.hasMany(Survey,{
    foreignKey:"indicator_id"
});

Survey.belongsTo(Indicators,{
    foreignKey:"indicator_id"
});

Components.hasMany(Survey,{
    foreignKey:"component_id"
});

Survey.belongsTo(Components,{
    foreignKey:"component_id"
});

Conditions.hasMany(Survey,{
    foreignKey:"condition_id"
});

Survey.belongsTo(Conditions,{
    foreignKey:"condition_id"
});

EvaluationModule.hasMany(Survey,{
    foreignKey:"evaluation_module_id"
});

Survey.belongsTo(EvaluationModule,{
    foreignKey:"evaluation_module_id"
});

module.exports=Survey;