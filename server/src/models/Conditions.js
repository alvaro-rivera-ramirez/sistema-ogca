const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");

const Conditions=sequelize.define("condition",{
    id_condition:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_condition:{
        type:DataTypes.STRING,
        allowNull:false
    },
    content_condition:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:false,
    tableName:"conditions"
});


module.exports=Conditions;