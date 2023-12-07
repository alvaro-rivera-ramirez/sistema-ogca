require("dotenv").config()
const Server=require("./server");
const sequelize=require("./src/config/database");

async function main(){
    try {
        const server = new Server();
        await sequelize.sync();
        server.listen();
        
    } catch (error) {
        console.log(error)
    }
}

(async()=>{
    await main();
})()
    