const database = require('../config/connection');

const saveQuestionData = async (req, res) => {
    try {
        const data = req.body; // data dari formulir
        const documentName = req.body.documentName;
        const result = await database.insertSurveyData('kumpulanPertanyaan', documentName, data);
        res.status(200).send('Data has been successfully saved.');
      } catch (error) {
        console.error('Failed to save data:', error);
        res.status(500).send('Failed to save data.');
      }
};

module.exports = { saveQuestionData };
