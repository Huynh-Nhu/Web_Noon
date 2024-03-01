const { response } = require("express");
const bcrypt = require("bcrypt");
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken')

const Staff = require ('../models/Staff');
const Auth = require('../models/Authorities');

const authService = require('../services/authService');
const sendEmail = require("../services/sendEmail");
const config = require('../config/index');
const { use } = require("passport");

let refreshTokens = [];
const StaffController ={
    // register staff
     registerStaff:async (req, res) =>{
        try {
            let  randomPassword = randomstring.generate(8);
            const hashed = await bcrypt.hash(randomPassword, 10);
            // create new user
            const newStaff = new Staff({
                nameStaff: req.body.nameStaff,
                phoneStaff: req.body.phoneStaff,
                passwordStaff: hashed,
                addressStaff: req.body.addressStaff,
                emailStaff: req.body.emailStaff
              });
            // save new user
            const staff = await authService.createdStaff(newStaff);
            //created authorities staff
            const newAuth = new Auth({
                idStaff: staff._id,
            })
            // save authorities staff
            const authorities = await authService.createdAuth(newAuth)
            
            await sendEmail.sendMail(staff.emailStaff, staff.nameStaff, randomPassword);

            // return result
            return res.status(200).json({staff,authorities,message:'password send successful',});
        } catch (error) {
            console.log('cannot register staff', error);
        }
    }, 
    // update avatar
    upDateAvatar: async(req, res) => {
      const {avatarStaff} = req.body;
    },
    // generate access token
    generateAccessToken: (newStaff) =>{
      return jwt.sign({
        id: newStaff._id,
        nameAuth: newStaff.authorities
      },
      config.jwt.secretkey,
      {expiresIn: '5d'}
      );
    },
    // generate refresh token 
    generateRefreshToken: (newStaff)=>{
      return jwt.sign({
        id: newStaff.id,
        nameAuth: newStaff.authorities
      },
      config.jwt.refresh,
      {expiresIn: '365d'}
      );
    },
    // login staff
    loginStaff:async (req, res) =>{
      try {
        const {email, password} = req.body;
        if(email === '') {
          return res.status(404).json({message: 'Vui lòng điền email của bạn '})
        }
        if(password === '') {
          return res.status(404).json({message: 'Vui lòng điền password của bạn '})
          
        }
        const staff = await authService.findOneStaff(email);
        if(!staff  ){
            return res.status(404).json({message:'Email này chưa đăng ký tài khoản, vui lòng đăng ký '})
        }
        if(!(await bcrypt.compare(password, staff.passwordStaff))){
          return res.status(404).json({message:'Password không đúng vui lòng nhập lại '})

        }
        const authorities = await authService.getAuthorities(staff.id)
        const newStaff = {
          ...staff,
          authorities: authorities.nameAuth
        }
         // access token
        const accessToken = StaffController.generateAccessToken(newStaff)
          //token reserved
        const refreshToken = StaffController.generateRefreshToken(newStaff)
          
        refreshTokens.push(refreshToken)
        const {passwordStaff, ...orthers} = staff._doc;
        return res.status(200).json({message: 'Chào bạn đến với Noon', ...orthers,accessToken,refreshToken});
      } catch (error) {
        console.log('cannot login staff', error);
      }
         
    },
    // refresh token 
    refreshTokens: async(req,res)=>{
      try {
        // get refresh token from staff       
        const refresh = req.body.refreshToken;
        console.log("refresh",refresh);
        if(!refresh)
          return res.status(401).json('you are not logged in')

          console.log("rerefreshTokens",refreshTokens);
        if(!refreshTokens.includes(refresh)){
          return res.status(401).json('refresh token is not authorized')
        }
        else{        
          jwt.verify(refresh,config.jwt.refresh, (err, newStaff) =>{
            if(err){
              console.log(err)
            }
            refreshTokens = refreshTokens.filter((token)=> token !== refresh)
              // created new access token, refresh token
            const newAccessToken = StaffController.generateAccessToken(newStaff);
            const newRefreshToken = StaffController.generateRefreshToken(newStaff);
            refreshTokens.push(newRefreshToken)
            console.log(refreshTokens);
            return res.status(200).json({accessToken: newAccessToken, refreshToken: newRefreshToken})
          } )
        }
      } catch (error) {
        console.log('cannot refresh token', error);
      }
    },
    // log out staff
    logoutStaff: async(req, res) => {
      // refresh token clear
      const refresh = req.body.refreshToken;
      refreshTokens = [];
      return res.status(200).json('logged out')
    },
    
    // get all staff have authorities 'Nhan vien'
     getAllStaff:async (req,res)=> {
      try {
        const staff = await authService.findAllStaff();
        const StaffNew = staff.map((item) => {
          const { passwordStaff, ...rest } = item._doc;
          return rest;
        });
        return res.status(200).json(StaffNew);
      } catch (error) {
        console.log('can not get all staff', error);
      }
    },
    // delete staff 
   deleteStaff:async(req, res)=> {
      try {
        const staff = await authService.deleteStaff(req.params.id)
        return res.status(200).json('delete staff successfullty')
      } catch (error) {
        console.log('can not delete staff', error);
      }
    },
    
}  

module.exports = StaffController;