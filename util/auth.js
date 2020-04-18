var authObj = {};

authObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

authObj.isAdmin = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.type === 'admin') 
            return next();
        return res.redirect('/items');
    }
    return res.redirect('/login');
}

module.exports = authObj;