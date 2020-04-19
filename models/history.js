var mongoose = require('mongoose');

var Purchase = mongoose.Schema({
    userid: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    items: [
        {
<<<<<<< HEAD
            itemid: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
            quantity: {type: Number, default: 1},
            size: {type: String},
=======
            itemid: {type: mongoose.Schema.Types.ObjectId, ref: 'Size', required: true},
            quantity: {type: Number, default: 1},
>>>>>>> master
            date: {type: Date, default: Date.now()}
        }
    ]
});

module.exports = mongoose.model('Purchase', Purchase);