const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Survey=require("./Survey");

const SurveyFile=sequelize.define("survey_file",{
    id_survey_file:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    dir_survey_file:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    name_survey_file:{
        type:DataTypes.STRING(100),
        allowNull:true
    }
},{
    timestamps:false,
    tableName:"survey_file"
});

Survey.hasMany(SurveyFile,{
    foreignKey:"survey_id"
})

SurveyFile.belongsTo(Survey,{
    foreignKey:"survey_id"
});

module.exports=SurveyFile;