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

router.get('/', function(req, res, next) {
    return res.redirect('items/1');
})

// items pages
router.get('/:page', function(req, res, next) {
    if (req.params.page === 'add') {
        return next();
    }
    if (isNaN(req.params.page)) {
        return res.redirect('items/1');
    }
    var itemsPerPage = 4;
    var page = Number(req.params.page) || 1;
    Item.find({deleted: false})
        .skip(itemsPerPage * (page-1))
        .limit(itemsPerPage)
        .exec(function(err, docs){
            if (err) {
                err = "Something went wrong while fetching items";
                return next(err);
            } 
            Item.count().exec(function(err, count) {
                if (err) {
                    err = "Something went wrong while counting items";
                    return next(err);
                }
                return res.render('items/index', {
                        items: docs, page: 
                        req.params.page, maxPages: 
                        Math.ceil(count/itemsPerPage)
                    });
            });
    });
});

// render a form to add a new item
router.get('/add', authObj.isAdmin, function(req, res, next) {
    return res.render('items/new');
});

// render a form to update a new item
router.get('/edit/:id', authObj.isAdmin, function(req, res, next) {
    Item.findOne({_id: req.params.id, deleted: false}, function(err, doc) {
        if (err) {
            err = "Something went wrong while fetching the item to be edited";
            return next(err);
        }
        return res.render('items/edit', {item: doc});
    })
})

// individual item page
router.get('/view/:id', function(req, res, next) {
    Item.findOne({_id: req.params.id, deleted: false}, function(err, doc) {
        if (err) {
            err = "Something went wrong while fetching the item";
            return next(err);
        }
        return res.render('items/item', {item: doc});
    });
});

// Create a new item with all item size of count 1
router.post('/add', authObj.isAdmin, upload.single('item-image'), function(req, res, next){
    var item = new Item({
        _id: new mongoose.Types.ObjectId(),
        itemname: req.body.itemname,
        description: req.body.description || "",
        category: req.body.category,
        price: req.body.price,
        imageUrl: req.file ? req.file.filename : 'default.jpg',
        deleted: false,
        sizes: {}
    });
    for (var size of sizes) {
        item.sizes[size] = 1;
    }
    item.save(function(err) {
        if (err) {
            err = "Something went wrong while adding items";
            return next(err);
        } 
        return res.redirect('/items/1');
    });
});

// Update a item
router.put('/edit/:id', authObj.isAdmin, upload.single('item-image'), function(req, res, next) {
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
        return res.redirect('/items/1');
    });
});

// Update item size
router.put('/edit/:id/sizes', authObj.isAdmin, function(req, res, next) {
    if (req.body.sizes) {
        for (let size of Object.keys(req.body.sizes)) {
            if (req.body.sizes[size] < 0) req.body.sizes[size] = 1;
            else if (req.body.sizes[size] > 200) req.body.sizes[size] = 200;
        }
    } else {
        err = "Bad request. Must contain item sizes";
        return res.status(400).json({err});
    }
    Item.findOneAndUpdate({itemid: req.params.id, deleted: false}, {sizes: req.body.sizes}, function(err, size) {
        if (err) {
            err = "Something went wrong while updating item count";
            return next(err);
        }
        return res.redirect('/items/1');
    });
})

// Delete a item - soft deletes the item
router.delete('/delete/:id', authObj.isAdmin, function(req, res, next) {
    Item.findById(req.params.id, function(err, doc){
        if (err) {
            err = "Something went wrong while deleting the item";
            return next(err);
        }
        // if (doc.get('imageUrl') && doc.get('imageUrl') !== 'default.jpg') {
        //     fs.unlink(path.join(path.resolve(__dirname, '..'), '/public/images/items/', doc.get('imageUrl')), function(err) {
        //         if (err) console.log(err);
        //     });
        // }   
        doc.update({deleted: true}, function(err) {
            if (err) {
                err = "Something went wrong while deleting the item";
                return next(err);
            }
            return res.status(302).json({message: "Item deleted successfully"})
        })
    });
})

module.exports = router;