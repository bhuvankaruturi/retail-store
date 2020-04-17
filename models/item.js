var mongoose = require('mongoose');

var Item = mongoose.Schema({
    itemname: {type: String, required: true},
    description: {type: String},
    price: {type: Number}
});

module.exports = mongoose.model('Item', Item);