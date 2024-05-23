const database = require('../config/connection');

const saveQuestionData = async (req, res) => {
    try {
      const formData = req.body;
      const files = req.files;

      console.log(files);
      } catch (error) {
        console.error('Failed to save data:', error);
        res.status(500).send('Failed to save data.');
      }
};

module.exports = { saveQuestionData };
