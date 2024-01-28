const dotenv = require('dotenv')
dotenv.config()

const config = {
    app: {
        port: process.env.PORT || 8080, 
    },
    db: {
        uri: process.env.MONGODB_URI
    },
    email: {
        user: process.env.EMAIL_USERNAME
    },
    pass:{
        password : process.env.EMAIL_PASSWORD
    },
    clientID: {
        id: process.env.GOOGLE_CLIENDID
    },
    clientSecret: {
        id: process.env.GOOGLE_CLIENT_SECRET
    },
    jwt:{
        secretkey: process.env.JWT_ACCESS_KEY,
        refresh: process.env.JWT_REFRESH_TOKEN,
    }


};

module.exports = config;