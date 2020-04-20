var mongoose = require('mongoose');

var Item = mongoose.Schema({
    itemname: {type: String, required: true},
    description: {type: String},
    category: {type: String, required: true},
    price: {type: Number},
    imageUrl: {type: String, default: '/images/default.jpg'},
    deleted: {type: Boolean, default: false},
    sizes: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Size'
        }
    ]
});

module.exports = mongoose.model('Item', Item);