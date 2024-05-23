const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: 'mongodb://127.0.0.1:27017/kumpulanPertanyaan',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      return {
        filename: 'file_' + Date.now(),
        bucketName: 'file_collection' // Nama collection untuk chunks
      };
    }
  });
  
  const upload = multer({ storage });

  module.exports ={upload};