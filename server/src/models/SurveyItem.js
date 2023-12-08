const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Survey=require("./Survey");
const Item=require("./Item");

const SurveyItem=sequelize.define("survey_item",{
    id_survey_item:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    value_survey_item:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
},{
    timestamps:false,
    tableName:"survey_item"
});

Survey.hasMany(SurveyItem,{
    foreignKey:"survey_id"
})

SurveyItem.belongsTo(Survey,{
    foreignKey:"survey_id"
})

Item.hasMany(SurveyItem,{
    foreignKey:"item_id"
})

SurveyItem.belongsTo(Item,{
    foreignKey:"item_id"
})

module.exports=SurveyItem;