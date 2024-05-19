const express = require('express');
const router = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const passport = require('passport');

const viewController = require('../controllers/viewController');
const dataController = require('../controllers/dataController');
const fileController = require('../controllers/fileController');
const fetchDatabases = require('../middlewares/fetchDatabases');
const { ensureAuthenticated, back, questions,ensureAdmin,ensureUser } = require('../middlewares/ensureAuthenticated');
const {saveQuestionData} = require('../controllers/saveDataController');

router.get('/admin', ensureAdmin, fetchDatabases, viewController.renderIndex);
router.post('/readData', fetchDatabases, viewController.renderReadData);
router.get('/createForm', fetchDatabases, viewController.renderCreateForm);
router.post('/showCollections', fetchDatabases, dataController.showCollections);
router.post('/uploadFile', upload.single('fileInput'), fileController.uploadFile);
router.get('/', back, viewController.renderLogin);
router.post('/register', dataController.createRegister);

router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/'); }
        const returnTo = req.session.returnTo || '/user';
        delete req.session.returnTo;
        req.logIn(user, (err) => {
            if (err) { return next(err); }

            if (user.role === 'admin') {
                return res.redirect('/admin');
            } else {
                return res.redirect(returnTo);
            }
        });
    })(req, res, next);
});
router.get('/user', ensureUser,viewController.renderUser);
router.get('/apiquestions/:id', viewController.ApiQuestions);
router.get('/questions/:id', questions, viewController.renderQuestions);
router.post('/save-question-data', ensureAuthenticated,saveQuestionData );

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) {
                console.error("Failed to destroy the session during logout.", err);
                return next(err);
            }
            res.redirect('/'); 
        });
    });
});

module.exports = router;
