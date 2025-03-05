const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const PartnerModel = new Schema({
    name: { type: String },
    shortName: {type: String},
    address: { type: String },
    email: { type: String },
    website: {type: String},
    logo: { type: String },
    phone: { type: String},
    state: {type: String, default: 'public'},
    human: {type: Object, default: {name:"", email: "", role: "", baRole: ""}},
    slug: {type:String, slug: 'name', unique: true}
   
},{timestamps: true})

module.exports = mongoose.model("Partner",PartnerModel)
