const multer = require('multer');
const path = require('path');
const Banner = require('../../models/Banner')


// Set up storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/banners'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
  });
  
  const upload = multer({ storage: storage });
  

  // add Banner Controller
  const BASE_URL = 'http://localhost:3002/uploads';
  const addBanner = async (req,res)=>{
    try {
       
        const imagePath = req.file ? `/banners/${req.file.filename}` : '';
        console.log(imagePath,"imagePath");
        
        const imageUrl = `${BASE_URL}${imagePath}`;


        // Check if image was uploaded
        if (!imageUrl) {
          return res.status(400).json({ message: 'Banner image is required' });
        }
    
        // Create and save the new banner
        const newBanner = new Banner({ imageUrl });
        await newBanner.save();
    
        res.status(201).json({ message: 'Banner added successfully', banner: newBanner });
      } catch (error) {
        res.status(500).json({ message: 'Error adding banner', error: error.message });
      }
  }  

  module.exports = {
    addBanner,
    upload,
  };
  