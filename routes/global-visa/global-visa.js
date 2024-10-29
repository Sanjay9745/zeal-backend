const GlobalVisa = require("../../models/GlobalVisa");
const path = require('path');


module.exports.get = async (req, res) => {
    try {
        const { page = 1, perPage = 10 } = req.query;

        const total = await GlobalVisa.countDocuments();
        const GlobalVisas = await GlobalVisa.find()
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        res.status(200).json({
            success: true,   
            results: GlobalVisas,
            page: parseInt(page),
            perPage: parseInt(perPage),
            total,
            totalPages: Math.ceil(total / perPage)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting GlobalVisas" });
    }
};

module.exports.getSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const globalVisa = await GlobalVisa.findById(id);

        if (!globalVisa) {
            return res.status(404).json({ success: false, message: 'GlobalVisa not found' });
        }

        res.status(200).json({ success: true, results: globalVisa });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting GlobalVisa" });
    }
};    

const BASE_URL = 'http://localhost:3002/uploads'; // Change this to your server's URL

    
module.exports.add = async (req, res) => {
    try {
        
        const images = req.files && req.files['images']   
            ? req.files['images'].map(file => `${BASE_URL}/images/${file.filename.replace(/\\/g, '/')}`) // Use forward slashes
            : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);
        
        console.log(req.files, "farhan");
                
     
                                       
        const thumbnail = req.files && req.files['thumbnail'] 
            ? `${BASE_URL}/thumbnails/${req.files['thumbnail'][0].filename.replace(/\\/g, '/')}` // Use forward slashes
            : (req.body.thumbnail || '');



        const newGlobalVisa = new GlobalVisa({
            ...req.body,
            images: images,
            thumbnail: thumbnail,
          
            
        });

        const savedGlobalVisa = await newGlobalVisa.save();

        res.status(200).json({ success: true, results: savedGlobalVisa });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}




module.exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        const images = req.files && req.files['images']   
            ? req.files['images'].map(file => `${BASE_URL}/images/${file.filename.replace(/\\/g, '/')}`) // Use forward slashes
            : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);
        
        console.log(req.files, "farhan");
                
     
                                       
        const thumbnail = req.files && req.files['thumbnail'] 
            ? `${BASE_URL}/thumbnails/${req.files['thumbnail'][0].filename.replace(/\\/g, '/')}` // Use forward slashes
            : (req.body.thumbnail || '');
            
        const updatedGlobalVisa = await GlobalVisa.findByIdAndUpdate(id, {
            ...req.body,
            images: images.length ? images : undefined, // Only update if new images are provided
            thumbnail: thumbnail || undefined, // Only update if a new thumbnail is provided
        }, { new: true, runValidators: true });

        console.log(updatedGlobalVisa,"updatedGlobalVisa");
        

        if (!updatedGlobalVisa) {
            return res.status(404).json({ success: false, message: 'GlobalVisa not found' });
        }

        res.status(200).json({ success: true, results: updatedGlobalVisa });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error updating GlobalVisa" });
    }
};




module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedGlobalVisa = await GlobalVisa.findByIdAndDelete(id);

        if (!deletedGlobalVisa) {
            return res.status(404).json({ success: false, message: 'GlobalVisa not found' });
        }

        res.status(200).json({ success: true, message: 'GlobalVisa deleted successfully', data: deletedGlobalVisa });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: 'Error deleting GlobalVisa' });
    }
};
