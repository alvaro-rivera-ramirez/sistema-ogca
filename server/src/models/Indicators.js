const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");

const Indicators=sequelize.define("indicator",{
    id_indicator:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_indicator:{
        type:DataTypes.STRING,
        allowNull:false
    },
    content_indicator:{
        type:DataTypes.TEXT,
        allowNull:false
    }
},{
    timestamps:false,
    tableName:"indicators"
});

module.exports=Indicators;