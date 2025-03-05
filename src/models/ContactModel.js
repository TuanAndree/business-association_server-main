const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ContactModel = new Schema({
    userName: { type: String, require: true },
    companyName: {type: String},
    phone:  {type: String},
    address: {type: String},
    email: {type: String},
    title: {type: String},
    content: {type: String}
}, {timestamps: true})

module.exports = mongoose.model("Contact", ContactModel)