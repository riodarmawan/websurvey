// middlewares/checkAdmin.js

module.exports = function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        console.log('sue');
        return next();
    } else {
        req.flash('error', 'You are not authorized to view this page');
        res.redirect('/');
    }
};
