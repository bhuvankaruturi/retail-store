var express = require('express');
var authObj = require('../util/auth');
var Cart = require('../models/cart');
var Item = require('../models/item');
// express router
var router = express.Router();

// TODO: replace json response with res.render
router.get('/', authObj.isLoggedIn, function(req, res, next){
   Cart.findOne({userid: req.user._id}, function(err, doc){
        if (err) {
            err = "Something went wrong while retrieving user's cart details";
            return next(err);
        }
        return res.status(200).json(doc);
   });
});

// add an item to cart
router.post('/', authObj.isLoggedIn, function(req, res, next){
    Item.exists({_id: req.body.id}, function(err, exists) {
        if (err) {
            err = "Item not found";
            return next(err);
        }
        if (exists) {
            Cart.findOne({userid: req.user._id}, function(err, cart) {
                if (err) {
                    err = "Something went wrong while fetching user cart";
                    return next(err);
                }
                var cartItem = {
                    itemid: req.body.id,
                    quantity: req.body.quantity || 1,
                    date: Date.now()
                };
                cart.items.push(cartItem);
                cart.save(function(err) {
                    if (err) {
                        err = "Something went wrong while adding item to cart";
                        return next(err);
                    }
                    res.redirect('/cart');
                });
            });
        }
    });
});

// update an item in the cart
router.put('/', authObj.isLoggedIn, function(req, res, next) {
    var modifiedCartItem = {'$set': {
        'items.$.quantity': req.body.quantity,
        'items.$.date': Date.now()
    }};
    Cart.findOneAndUpdate({userid: req.user._id, 'items._id': req.body.id}, modifiedCartItem, function(err, cart) {
        if (err) {
            err = "Something went wrong while fetching user cart";
            return next(err);
        }
        res.redirect('/cart');
    });
});

// delete an item in the cart
router.delete('/', authObj.isLoggedIn, function(req, res, next) {
    Cart.findOneAndUpdate({userid: req.user._id}, {$pull: {items: {_id: req.body.id}}}, function (err, cart){
        if (err) {
            console.log(err);
            err = "Something went wrong while deleting the item from cart";
            return next(err);
        }
        res.redirect('/cart');
    });
});

module.exports = router;