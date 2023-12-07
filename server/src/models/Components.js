const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");

const Components=sequelize.define("component",{
    id_component:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_component:{
        type:DataTypes.STRING,
        allowNull:false
    },
    purpose_component:{
        type:DataTypes.STRING,
        allowNull:true
    },
    content_component:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:false,
    tableName:"components"
});

module.exports=Components;