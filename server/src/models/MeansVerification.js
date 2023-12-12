const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");

const MeansVerification=sequelize.define("means_verification",{
    id_means_verification:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_means_verification:{
        type:DataTypes.STRING,
        allowNull:false
    },
    code_means_verification:{
        type:DataTypes.STRING(3),
        allowNull:false
    },
    content_means_verification:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    short_content_means_verification:{
        type:DataTypes.STRING(500),
        allowNull:false
    }
},{
    timestamps:false,
    tableName:"means_verification"
});



module.exports=MeansVerification;