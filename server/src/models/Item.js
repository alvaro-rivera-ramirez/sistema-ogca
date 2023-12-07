const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Item=sequelize.define("item",{
    id_item:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_item:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    type_item:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
},{
    timestamps:false,
    tableName:"item"
});


module.exports=Item;