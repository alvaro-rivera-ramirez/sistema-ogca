const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");
const Institutes=require("./Institutes");

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
    },
    porcent_means_verification:{
        type:DataTypes.DECIMAL(5,2),
        allowNull:true
    },
    institutions_involved:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    timestamps:false,
    tableName:"means_verification"
});

Institutes.hasMany(MeansVerification,{
    foreignKey:"institute_id"
});

MeansVerification.belongsTo(Institutes,{
    foreignKey:"institute_id"
});

module.exports=MeansVerification;