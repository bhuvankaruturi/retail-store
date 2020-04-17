var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var User = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
