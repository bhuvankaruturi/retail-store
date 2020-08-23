var express = require('express');
var authObj = require('../util/auth');
var moment = require('moment');
var Cart = require('../models/cart');
var Item = require('../models/item');
var History = require('../models/history');
var User = require('../models/user');
// express router
var router = express.Router();

// user cart page
router.get('/', authObj.isLoggedIn, function(req, res, next){
   Cart.findOne({userid: req.user._id}).populate('items.itemid').exec(function(err, doc){
        if (err) {
            err = "Something went wrong while retrieving user's cart details";
            return next(err);
        }
        let total = 0;
        doc.items.forEach(item => {
            total += item.itemid.price * item.quantity;
        });
        return res.render('cart/index', {cart: doc, moment: moment, total: total});
   });
});

// add an item to cart
router.post('/add', authObj.isLoggedIn, function(req, res, next){
    Item.exists({_id: req.body.id}, function(err, exists) {
        if (err) {
            err = "Item not found";
            return next(err);
        }
        if (exists) {
            return Cart.findOne({userid: req.user._id}, function(err, cart) {
                if (err) {
                    err = "Something went wrong while fetching user cart";
                    return next(err);
                }
                var cartItem = {
                    itemid: req.body.id,
                    size: req.body.size,
                    quantity: req.body.quantity || 1,
                    date: Date.now()
                };
                cart.items.push(cartItem);
                cart.save(function(err) {
                    if (err) {
                        err = "Something went wrong while adding item to cart";
                        return next(err);
                    }
                    User.findOneAndUpdate({_id: req.user._id}, {$inc: {cartSize: 1}}, function(err, doc) {
                        if (err) {
                            err = "Something went wrong while updating cart details";
                            return next(err);
                        }
                        console.log(doc);
                        return res.redirect('/items/view/' + req.body.id);
                    })
                });
            });
        } else {
            err = "Item not found";
            return next(err);
        }
    });
});

// update an item in the cart
router.put('/edit', authObj.isLoggedIn, function(req, res, next) {
    var modifiedCartItem = {'$set': {
        'items.$.quantity': req.body.quantity,
        'items.$.size': req.body.size,
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
router.delete('/delete/:id', authObj.isLoggedIn, function(req, res, next) {
    Cart.findOneAndUpdate({userid: req.user._id}, {$pull: {items: {_id: req.params.id}}}, function (err, cart){
        if (err) {
            err = "Something went wrong while deleting the item from cart";
            return next(err);
        }
        User.findOneAndUpdate({_id: req.user._id, cartSize: {$gte: 1}}, {$inc: {cartSize: -1}}, function(err, doc) {
            if (err) {
                err = "Something went wrong while updating cart details";
                return next(err);
            }
            return res.redirect('/cart');
        })
    });
});

// purchase route - add all items in card to history
router.post('/purchase', authObj.isLoggedIn, function(req, res, next) {
    Cart.findOne({userid: req.user._id}, function (err, cart) {
        if (err) {
            err = "Cannot complete the order now";
            return next(err);
        } 
        if (cart.items.length <= 0) {
            res.redirect('/cart');
        }
        History.findOne({userid: req.user._id}, function(err, history){
            for (var cartItem of cart.items) {
                history.items.push({
                    itemid: cartItem.itemid,
                    quantity: cartItem.quantity,
                    size: cartItem.size,
                    date: Date.now()
                });
            }
            cart.update({items: []}, function(err, cart) {
                if (err) {
                    err = "Cannot complete the order now";
                    return next(err);
                }
                history.save(function(err) {
                    if (err) {
                        err = "Something went wrong while adding items to history";
                        return next(err);
                    }
                    User.findOneAndUpdate({_id: req.user._id}, {cartSize: 0}, function(err, doc) {
                        if (err) {
                            err = "Something went wrong while updating cart details";
                            return next(err);
                        }
                        return res.redirect('/history/');;
                    })
                });
            });
        })
    })
});

module.exports = router;