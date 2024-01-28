const mongoose = require('mongoose')


const customerScheme = new mongoose.Schema({
    nameCustomer:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20
    },
    phoneCustomer:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 11
    },
    passwordCustomer:{
        type: String,
        required: true,
        minlength: 1,
    },
    emailCustomer:{
        type: String,
        required: true,
    },
    membershipLevel:{
        type: String,
        default:'membership'
    },
    avatarCustomer:{
        type: String,
    },

})

module.exports = mongoose.model('Customer',customerScheme );