const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
    postID: {type: String},
    parentID: {type:String},
    name: {type: String},
    content: {type: String}
}, {timestamps: true})

module.exports = mongoose.model('Comment', Comment);
