const { handleHttpError, handleErrorResponse } = require("../middleware/handle.error.middleware")
const instituteService=require("../services/institution.service")
const sequelize=require("../config/database");
const {nanoid} = require("nanoid")


const getInstitute=async(req,res)=>{
    try {
        const {query}=req;
        const institutes=await instituteService.getAllInstitute(query);
        res.json(institutes)
    } catch (error) {
        handleHttpError(res,error);
    }
}

const createInstitute = async (req, res) => {
    const { instituteObject } = req.body;
    console.log(instituteObject);
    const { transaction } = req; // Esto asume que estás manejando transacciones en middleware
    try {
      const instituteCreated = await instituteService.createInstitute(instituteObject, transaction);
      // Enviar una respuesta de éxito
      res.status(201).json({ success: true, institute: instituteCreated });
    } catch (error) {
      // Manejar el error y enviar una respuesta de error
      console.error(error);
      res.status(500).json({ success: false, error: "Error al crear la institución" });
    }
  };

module.exports={
    getInstitute,
    createInstitute
}