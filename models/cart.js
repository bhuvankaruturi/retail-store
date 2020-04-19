var mongoose = require('mongoose');

var Cart = mongoose.Schema({
    userid: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    items: [
        {
            itemid: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
            quantity: {type: Number, default: 1},
            size: {type: String},
            date: {type: Date, default: Date.now()}
        }
    ]
});

module.exports = mongoose.model('Cart', Cart);