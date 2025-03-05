const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const postModel = new Schema({
    title: { type: String, require: true },
    postTypeID: {type: String},
    description: {type: String},
    content: { type: String, require: true },
    attachments: { type: Array, default: [{image: "", title: ""}] },
    state: {type: String},
    parentID: {type: String},
    state: {type: String, default: 'public'},
    slug: {type:String, slug:'title', unique: true},
    
},{timestamps:true} )

module.exports = mongoose.model("Post",postModel)