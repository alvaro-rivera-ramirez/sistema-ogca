const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Roles=require("./Roles");
const Institutes=require("./Institutes");

const Users=sequelize.define("user",{
    id_user:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email_user:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true,
    },
    name_user:{
        type:DataTypes.STRING,
        allowNull:false, 
    },
    lastname_user:{
        type:DataTypes.STRING,
        allowNull:false, 
    },
    dni_user:{
        type:DataTypes.STRING(20),
        allowNull:true,
        unique:true
    },
    phone_user:{
        type:DataTypes.STRING,
        allowNull:false, 
    },
    password_user:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    code_user:{
        type:DataTypes.STRING(15),
        allowNull:false, 
    },
},{
    timestamps:false,
    tableName:"users"
});

Roles.hasMany(Users,{
    foreignKey:"role_id"
})

Users.belongsTo(Roles,{
    foreignKey:"role_id"
});

Institutes.hasMany(Users,{
    foreignKey:"institute_id"
});

Users.belongsTo(Institutes,{
    foreignKey:"institute_id"
});

module.exports=Users;