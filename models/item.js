var mongoose = require('mongoose');

var Item = mongoose.Schema({
    itemname: {type: String, required: true},
    description: {type: String},
    price: {type: Number},
    imageUrl: {type: String, default: '/images/default.jpg'},
    sizes: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Size'
        }
    ]
});

module.exports = mongoose.model('Item', Item);