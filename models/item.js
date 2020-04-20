var mongoose = require('mongoose');

var Item = mongoose.Schema({
    itemname: {type: String, required: true},
    description: {type: String},
    category: {type: String, required: true},
    price: {type: Number},
    imageUrl: {type: String, default: '/images/default.jpg'},
    deleted: {type: Boolean, default: false},
    sizes: {
        'XL': {type: Number, min: 1, max: 200, default: 1},
        'L': {type: Number, min: 1, max: 200, default: 1},
        'M': {type: Number, min: 1, max: 200, default: 1},
        'S': {type: Number, min: 1, max: 200, default: 1},
        'XS': {type: Number, min: 1, max: 200, default: 1},
    }
});

module.exports = mongoose.model('Item', Item);