const database = require('../config/connection');

renderIndex = async (req, res) => {
    try {
        const documents = await database.listDocuments('kumpulanPertanyaan', 'surveys');
        res.render('pages/index', {
            layout: 'layouts/main-layout',
            documents: documents
        });
    } catch (err) {
        console.error('Failed to render admin page:', err);
        res.status(500).send('Failed to render admin page');
    }
};

renderReadData = (req, res) => {
    const databaseName = req.body.databaseName;
    const collectionName = req.body.databaseName;
    res.render('pages/readData', {
        layout: 'layouts/main-layout',
        databaseName: databaseName,
        collectionName: collectionName
    });
};

renderCreateForm = (req, res) => {
    res.render('pages/createForm', {
        layout: 'layouts/main-layout',
    });
};

renderLogin = (req, res) => {
    console.log('diakses dari halaman login');
    res.render('pages/login', {
        layout: false,
        messages: req.flash(),
    });
};

ApiQuestions = async (req, res) => {
    const id = req.params.id;
    try {
        const entries = await database.getDocumentData('kumpulanPertanyaan', 'surveys', id);
        if (!entries || entries.length === 0) {
            return res.status(404).json({ error: 'No entries found' });
        }
        res.json(entries[1]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

const renderQuestions = async (req, res) => {
    const id = req.params.id;
    try {
        const document = await database.findDocumentById('kumpulanPertanyaan', 'surveys', id);
        if (!document) {
            return res.status(404).send('No document found');
        }

        const documentName = Object.keys(document).find(key => key !== '_id'); // Ambil nama dokumen
        const username = req.user.username; // Assuming username is stored in the session
        console.log(username);

        res.render('pages/questions', {
            layout: false,
            id: id,
            name: documentName,
            username: username
        });
    } catch (error) {
        console.error('Failed to render questions page:', error);
        res.status(500).send('Failed to render questions page');
    }
};

renderUser = async (req, res) => {
    res.render('pages/user', {
        layout: false,
    });
};

renderAdmin = async (req, res) => {

};

module.exports = {
    renderIndex,
    renderReadData,
    renderCreateForm,
    renderLogin,
    ApiQuestions,
    renderQuestions,
    renderUser,
    renderAdmin
};
