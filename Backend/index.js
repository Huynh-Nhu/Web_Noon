const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const route = require('./src/routers')
const config = require('./src/app/config/index')

const app = express()


passport.use(
    new GoogleStrategy(
    {
    clientID: config.clientID.id,
    clientSecret: config.clientSecret.id,
    callbackURL: 'auth/google/callback'
    },
    accessToken => {
        console.log(accessToken);
    }
))

app.use(cors())
app.options('*',cors())
app.use(express.json())
app.use(morgan('combined'))
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true,
}))

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    const user = req.user
})




// router 
route(app);


module.exports = app;