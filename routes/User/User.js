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
       
      // Log req.files to check if files are being received
    console.log(req.files, "req.files");

          // Create an array of image URLs from uploaded files
       const imageUrls = req.files.map((file) => `${BASE_URL}/banners/${file.filename}`);
       console.log(imageUrls, "imageUrls");


        // Check if image was uploaded
        if (!imageUrls) {
          return res.status(400).json({ message: 'Banner image is required' });
        }
    
        // Create and save the new banner 
        const newBanner = new Banner({ imageUrls });
        console.log(newBanner,"newBanner");
        
        await newBanner.save();
    
        res.status(201).json({ message: 'Banner added successfully', banner: newBanner });
      } catch (error) {
        res.status(500).json({ message: 'Error adding banner', error: error.message });
      }
  }  


  const getBanner = async (req,res)=>{
    try {
      const BannerImages = await Banner.find()
       // Send the banners as a response
      res.status(200).json({ message: 'Banners retrieved successfully', BannerImages }); 
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving banners', error: error.message });
    }
  }

  module.exports = {
    addBanner,
    upload,
    getBanner
  };
  