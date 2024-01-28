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
                avatarStaff: req.body.avatarStaff,
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
    // generate access token
    generateAccessToken: (newStaff) =>{
      return jwt.sign({
        id: newStaff._id,
        nameAuth: newStaff.authorities
      },
      config.jwt.secretkey,
      {expiresIn: '10s'}
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
        const staff = await authService.findOneStaff(email);
        if(!staff || !(await bcrypt.compare(password, staff.passwordStaff))){
            return res.status(404).json({message:'email or password is incorrect'})
        } else{
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
            return res.status(200).json({message: 'login successful', ...orthers,accessToken,refreshToken});
        }
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
        console.log("kho", refreshTokens);
        if(!refresh)
          return res.status(401).json('you are not logged in')
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
      res.clearCookie('refreshToken');
      refreshTokens = refreshTokens.filter((token)=> token !== req.cookies.refreshToken);
      return res.status(200).json('logged out')
    },
    
    // get all staff have authorities 'Nhan vien'
     getAllStaff:async (req,res)=> {
      try {
        console.log('nhu');
        const staff = await authService.findAllStaff();
        return res.status(200).json(staff);
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
    }
}  

module.exports = StaffController;