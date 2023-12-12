const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");
const MeansVerification=require("./MeansVerification");
const Conditions=require("./Conditions");
const Components=require("./Components");
const Indicators=require("./Indicators");
const Institutes=require("./Institutes");

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
    },
    status_survey:{
        type:DataTypes.TINYINT(1),
        allowNull:false,
        defaultValue:0
    },
    institutions_involved:{
        type:DataTypes.STRING,
        allowNull:true
    },
    name_item_institute:{
        type:DataTypes.STRING(55),
        allowNull:true
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

Institutes.hasMany(Survey,{
    foreignKey:"institute_id"
});

Survey.belongsTo(Institutes,{
    foreignKey:"institute_id"
});
module.exports=Survey;