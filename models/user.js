const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const pasportLocalMongoose = require('passport-local-mongoose')  // this package helps use to add authentication easily. It provides properties and methods to authenticate user. We can also use different register option such as google, fackbook, twitter etc

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(pasportLocalMongoose); // here in model we are not adding username and password fields because these are added automatically using plugin method. This also provide methods to encrypt and store password

module.exports = mongoose.model('User', UserSchema)