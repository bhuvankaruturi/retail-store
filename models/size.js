var mongoose = require('mongoose');

var Size = mongoose.Schema({
    itemid: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
    size: {type: String, required: true},
    count: {type: Number, default: 1}
});

module.exports = mongoose.model('Size', Size);