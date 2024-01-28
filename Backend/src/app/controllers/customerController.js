const { response } = require("express");
const bcrypt = require("bcrypt");
const Customer = require('../models/Customer')
const Address  = require('../models/Address')

const authService = require('../services/authService')

const customerController = {
    // register customer
     registerCustomer: async ( req, res) =>{
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.passwordCustomer, salt);
            // created customer
            const newCustomer = new Customer({
                nameCustomer: req.body.nameCustomer,
                passwordCustomer: hashPassword,
                phoneCustomer: req.body.phoneCustomer,
                avatarCustomer: req.body.avatarCustomer,
                emailCustomer: req.body.emailCustomer,
            })
            // save customer
            const customer = await authService.createdCustomer(newCustomer)
            // created address
            const newAddress = new Address({
                idCustomer: customer._id,
                nameAddress: req.body.nameAddress,

            })
            // create address
            const address = await authService.createdAddress(newAddress)
            res.status(200).json('success',customer, address)
        } catch (error) {
            console.log('cannot register customer', error);
        }
    },
    // login customer
    loginCustomer: async(req, res) => {
        try {
            const {emailOrPhone, password} = req.body;
            const customer = await authService.findOneCustomer(emailOrPhone);
            if(!customer || !(await bcrypt.compare(password, customer.passwordCustomer))){
                return res.status(404).json({message:'Email/phone or password is incorrect'})
            } else {
                return res.status(200).json({message:'Success login customer', customer})
            }
        } catch (error) {
            console.log('cannot login customer', error);
        }
    }
}
module.exports = customerController;
