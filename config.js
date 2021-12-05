require('dotenv').config()

const { env } = process
module.exports = {
    TOKEN: env.TOKEN,
    POSTGRES: env.POSTGRES,
    OPTIONS: {
        polling: true,
    }
}
