const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TempModel = new Schema({
    data: {type: Object},
    type: {type: String},
    method: {type: String},
    state: {type: String}
}, {timestamps: true})

module.exports = mongoose.model('Temp', TempModel);
