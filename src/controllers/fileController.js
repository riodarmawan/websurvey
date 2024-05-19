const database = require('../config/connection');

uploadFile = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    const fileContent = file.buffer.toString('utf8');
    try {
        const isValidStructure = checkFileStructure(fileContent);
        if (isValidStructure) {
            const parse = JSON.parse(fileContent);
            const fileName = file.originalname;
            const surveyKey = fileName.substring(0, fileName.indexOf('.'));
            const surveyData = { [surveyKey]: parse }; // Using file name as the key
            const result = await database.insertSurveyData('kumpulanPertanyaan', 'surveys', surveyData);
            
            res.redirect('/');
        } else {
            res.status(400).send('Invalid file structure.');
        }
    } catch (error) {
        console.error('Error processing file content:', error);
        res.status(500).send('Error processing file content.');
    }
}

function checkFileStructure(content) {
    try {
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) && parsed.every(questionData => {
            let keys = Object.keys(questionData);
            return keys.includes("pertanyaan") && keys.includes("option");
        });
    } catch {
        return false;
    }
}

module.exports = { uploadFile };
