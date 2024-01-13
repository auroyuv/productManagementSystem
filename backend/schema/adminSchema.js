const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username: String,
    email: String,
    mobileNo: String,
    password: String,
    image: String,
})

module.exports = mongoose.model('admins', adminSchema)