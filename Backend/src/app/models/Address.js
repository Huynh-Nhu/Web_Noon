const mongoose = require('mongoose')
const Customer = require('./Customer')

const addressScheme = new mongoose.Schema({
    idCustomer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Customer,
    },
    nameAddress:{
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Address',addressScheme );