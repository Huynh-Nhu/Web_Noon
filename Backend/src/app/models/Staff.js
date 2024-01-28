const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    nameStaff:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20
    },
    phoneStaff:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 11
    },
    passwordStaff:{
        type: String,
        required: true,
    },
    emailStaff:{
        type: String,
        required: true,
    },
    addressStaff:{
        type: String,
        required: true,
    },
    avatarStaff:{
        type: String,
    },
    
})

module.exports = mongoose.model('Staff', staffSchema);
