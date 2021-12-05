const {Sequelize} = require('sequelize')
const {POSTGRES} = require("../config")
const Models = require("./models")

const sequelize = new Sequelize(POSTGRES, {
    logging: false
})

async function postgres(){
    try{
        let db = {}

        db.users = await Models.UserModel(Sequelize, sequelize)

        await sequelize.sync({force: false})

        return db
    }catch(error){
        console.log(error);
    }
}

module.exports = postgres
