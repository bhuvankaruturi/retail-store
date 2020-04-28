var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var User = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    type: {type: String, default: 'user'},
    cartSize: {type: Number, default: 0, min: 0}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
