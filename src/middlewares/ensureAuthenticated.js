function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl; // Store the original URL in the session
    res.redirect('/');
}

function back(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        res.redirect('/admin');
    }
    else if(req.isAuthenticated()){
        res.redirect('/user');
    }
    else{ 
        next();
    }
}

function questions(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Check if the requested URL matches /questions/:id pattern
    if (req.path.startsWith('/questions')) {
        req.session.returnTo = req.originalUrl; // Store the original URL in the session
        console.log(`Stored URL: ${req.session.returnTo}`);
    }
    res.redirect('/');
}

function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access denied.');
}
function ensureUser(req, res, next) {
    if (req.isAuthenticated() && req.user.role !== 'admin') {
        return next();
    }
    res.status(403).send('Access denied.');
}


module.exports = { ensureAuthenticated, back, questions, ensureAdmin,ensureUser};
