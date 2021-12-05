module.exports = class Models{
    static async UserModel (Sequelize, sequelize){
        return await sequelize.define('users', {
            user_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            chat_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
            },
            step: {
                type: Sequelize.SMALLINT,
                defaultValue: 1,
            },
            product_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            long: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            lat: {
                type: Sequelize.FLOAT,
                allowNull: true,
            }
        })
    }
}
