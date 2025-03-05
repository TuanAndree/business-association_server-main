module.exports = {

    multiMongooseToObject: function(array) {
        return array.map(item => item.toObject())
    },

    mongooseToObject: function(mongoose) {
        return mongoose.toObject();
    }
}