const mongoose = require('mongoose');
const Staff = require ('./Staff')

const authoritiesSchema = new mongoose.Schema({
    idStaff:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Staff,
    },
    nameAuth:{
        type: String,
       default: 'Nhân viên'
    }

})

module.exports = mongoose.model('Authorities',authoritiesSchema )