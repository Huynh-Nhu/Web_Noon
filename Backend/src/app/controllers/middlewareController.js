const jwt = require ('jsonwebtoken')
const config = require('../config/index');
const { response } = require("express");



const MiddlewareController = {
    // confirm token
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if(token) {
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken,config.jwt.secretkey, (err, user)=> {
                if(err) {
                    
                    res.status(403).json('Token is not valid')
                }
                req.user = user;
                next();
            })
        } else{
            return res.status(401).json('you are not authenticated');
        }
    },
    verifyTokenAndAdmin:(req, res, next) => {
        console.log(req.body);
        MiddlewareController.verifyToken(req, res, ()=> {
            if(req.user.id == req.params.id || req.user.nameAuth === 'admin' ){
                next();
            } else {
                res.status(403).json('you are not allowed to')
            }
        })
    }
}

module.exports = MiddlewareController;