const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    fullName: {type: String},
    email: {type: String},
    password: {type: String},
    role: {type: String},
    description: {type: String}
}, {timestamps: true})

module.exports = mongoose.model('User', userModel);
