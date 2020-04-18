var express = require('express');
var mongoose = require('mongoose');
var Item = require('../models/item');
var Size = require('../models/size');
var sizes = require('../util/sizes');
var router = express.Router();

// TODO: replace json response with res.render
router.get('/', function(req, res, next) {
    Item.find().exec(function(err, docs){
        if (err) {
            err = "Something went wrong while fetching items";
            return next(err);
        } 
        return res.status(200).json(docs);
    });
});

// Create a new item with all item size of count 1
router.post('/add', function(req, res, next){
    var item = new Item({
        _id: new mongoose.Types.ObjectId(),
        itemname: req.body.itemname,
        description: req.body.description || "",
        price: req.body.price
    });
    var itemSizes = [];
    for (var size of sizes) {
        let newItemSize = new Size({
            _id: new mongoose.Types.ObjectId(),
            itemid: item._id,
            size: size,
            count: 1
        });
        item.sizes.push(newItemSize._id);
        itemSizes.push(newItemSize);
    }
    item.save(function(err) {
        if (err) {
            err = "Something went wrong while adding items";
            return next(err);
        } 
        Size.create(itemSizes, function(err) {
            if (err) {
                err = "Something went wrong while adding item sizes";
                return next(err);
            }  
            res.redirect('/items');
        });
    });
});

// Update a item
router.put('/:id', function(req, res, next) {
    Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, item){
        if (err) {
            err = "Something went wrong while updating the item";
            return next(err);
        }
        res.redirect('/items');
    });
});

// Delete a item
router.delete('/:id', function(req, res, next) {
    Item.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            err = "Something went wrong while deleting the item";
            return next(err);
        }
        res.redirect('/items');
    })
})

module.exports = router;