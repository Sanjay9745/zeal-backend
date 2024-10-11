const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Function to ensure directory exists
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    if (file.fieldname === 'images') {
      uploadPath = 'uploads/images/';
    } else if (file.fieldname === 'thumbnail') {
      uploadPath = 'uploads/thumbnails/';
    } else if (file.fieldname === 'pdf') {
      uploadPath = 'uploads/pdfs/';
    } else if (file.fieldname === 'itineraryImages') {
      uploadPath = 'uploads/images/';
    }

    // Ensure the directory exists
    ensureDirectoryExistence(uploadPath);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp and random string
    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname).toLowerCase()}`;
    cb(null, uniqueName);
  },
});

// Set up Multer file filter
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|pdf/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only images (jpeg, jpg, png) and PDFs are allowed!');
  }
};

// Initialize Multer with a size limit of 50MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB size limit
  fileFilter: fileFilter,
});

module.exports = upload;