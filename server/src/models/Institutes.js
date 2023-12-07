const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");

const Institutes=sequelize.define("institute",{
    id_institute:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_institute:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true,
    },
    acronim_institute:{
        type:DataTypes.STRING(10),
        allowNull:false, 
    },
    email_institute:{
        type:DataTypes.STRING(100),
        allowNull:false, 
    },
},{
    timestamps:false,
    tableName:"institutes"
});

module.exports=Institutes;