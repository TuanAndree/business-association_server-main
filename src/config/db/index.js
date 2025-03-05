const mongoose = require('mongoose');

const mongoose_slug = require('mongoose-slug-updater');


async function connect() {

    try {
        await mongoose.connect('mongodb+srv://nhom2:nhom2@mongodb.lmt8giw.mongodb.net/hiephoidoanhnghiep');
        mongoose.plugin(mongoose_slug);
    }
    catch(err) {
        console.log('connect failedly. Error: ',err);
    }

}

module.exports = {connect};