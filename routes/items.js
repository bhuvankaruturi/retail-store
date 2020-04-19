var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
// authentication middleware
var authObj = require('../util/auth');
// multer for image upload
var multer  = require('multer')
// mongoose models
var Item = require('../models/item');
var Size = require('../models/size');
// valid size for item
var sizes = require('../util/sizes');

var router = express.Router();

// multer configuration
var storage = multer.diskStorage({
    destination: path.join(path.resolve(__dirname, '..'), '/public/images/items'), 
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const extension = file.originalname.match(/\.[0-9a-z]+$/i)[0];
      cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});
var upload = multer({ storage: storage})

<<<<<<< HEAD
// items pages
=======
// TODO: replace json response with res.render
>>>>>>> master
router.get('/', function(req, res, next) {
    Item.find().populate('sizes').exec(function(err, docs){
        if (err) {
            err = "Something went wrong while fetching items";
            return next(err);
        } 
<<<<<<< HEAD
        return res.render('items/index', {items: docs})
    });
});

// individual item page
=======
        return res.status(200).json(docs);
    });
});

// TODO: replace json response with res.render
>>>>>>> master
router.get('/:id', function(req, res, next) {
    Item.findById(req.params.id).populate('sizes').exec(function(err, doc) {
        if (err) {
            err = "Something went wrong while fetching the item";
            return next(err);
        }
<<<<<<< HEAD
        return res.render('items/item', {item: doc});
=======
        return res.status(200).json(doc);
>>>>>>> master
    });
})

// Create a new item with all item size of count 1
router.post('/add', authObj.isAdmin, upload.single('item_image'), function(req, res, next){
    var item = new Item({
        _id: new mongoose.Types.ObjectId(),
        itemname: req.body.itemname,
        description: req.body.description || "",
<<<<<<< HEAD
        category: req.body.category,
=======
>>>>>>> master
        price: req.body.price,
        imageUrl: req.file.filename || 'default.jpg'
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
router.put('/:id', authObj.isAdmin, upload.single('item_image'), function(req, res, next) {
    if (req.file) {
        if (req.body.imageUrl) {
            fs.unlink(path.join(path.resolve(__dirname, '..'), '/public/images/items/', req.body.imageUrl), function(err) {
                if (err) console.log(err);
            });
        }
        req.body.imageUrl = req.file.filename;
    }
    Item.findByIdAndUpdate(req.params.id, req.body, function(err, item){
        if (err) {
            err = "Something went wrong while updating the item";
            return next(err);
        }
        res.redirect('/items');
    });
});

// Update item size
router.put('/:id/:size', authObj.isAdmin, function(req, res, next) {
    let newSizeItem = {
        count: Number(req.body.count) < 0 ? 0 : Number(req.body.count)
    }
    console.log(req.body);
    Size.findOneAndUpdate({itemid: req.params.id, size: req.params.size}, newSizeItem, function(err, size) {
        if (err) {
            err = "Something went wrong while updating item count";
            return next(err);
        }
        return res.redirect('/items');
    });
})

// Delete a item
router.delete('/:id', authObj.isAdmin, function(req, res, next) {
    Item.findById(req.params.id, function(err, doc){
        if (err) {
            err = "Something went wrong while deleting the item";
            return next(err);
        }
        if (doc.get('imageUrl') && doc.get('imageUrl') !== 'default.jpg') {
            fs.unlink(path.join(path.resolve(__dirname, '..'), '/public/images/items/', doc.get('imageUrl')), function(err) {
                if (err) console.log(err);
            });
        }   
        doc.remove(function(err) {
            if (err) {
                err = "Something went wrong while deleting the item";
                return next(err);
            }
            res.redirect('/items');
        })
    });
})

module.exports = router;