var mongoose = require('mongoose');

var Purchase = mongoose.Schema({
    username: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    items: [
        {
            itemid: {type: mongoose.Schema.Types.ObjectId, ref: 'Size', required: true},
            quantity: {type: Number, default: 1},
            date: {type: Date, default: Date.now()}
        }
    ]
});

module.exports = mongoose.model('Purchase', Purchase);