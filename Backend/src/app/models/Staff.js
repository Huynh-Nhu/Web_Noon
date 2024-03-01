const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    nameStaff:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10
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
    // avatarStaff:{
    //     type: String,
    //     default: "https://res.cloudinary.com/defr8pudf/image/upload/v1707297042/Noon/z5144099427074_50065a08f86e0ebfd35a04d466d96b9b_tyg2be.jpg"
    // },
    avatarStaff:{
        type: String
    }
})

module.exports = mongoose.model('Staff', staffSchema);
