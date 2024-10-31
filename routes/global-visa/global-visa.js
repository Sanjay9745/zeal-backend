const GlobalVisa = require("../../models/GlobalVisa");

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

module.exports.add = async (req, res) => {
    try {
        console.log(req.body);
        
        const images = req.files && req.files['images'] 
            ? req.files['images'].map(file => file.path) 
            : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);
        
        // Get thumbnail from files or fallback to req.body
        const thumbnail = req.files && req.files['thumbnail'] 
            ? req.files['thumbnail'][0].path 
            : (req.body.thumbnail || '');

        const newGlobalVisa = new GlobalVisa({
            ...req.body,
            images: images,
            thumbnail: thumbnail,
        });

        const savedGlobalVisa = await newGlobalVisa.save();

        res.status(200).json({ success: true, results: savedGlobalVisa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message, message: "Error adding GlobalVisa" });
    }
};

module.exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const images = req.files && req.files['images'] 
            ? req.files['images'].map(file => file.path) 
            : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);
        
        const thumbnail = req.files && req.files['thumbnail'] 
            ? req.files['thumbnail'][0].path 
            : (req.body.thumbnail || '');
            
        const updatedGlobalVisa = await GlobalVisa.findByIdAndUpdate(id, {
            ...req.body,
            images: images.length ? images : undefined, // Only update if new images are provided
            thumbnail: thumbnail || undefined, // Only update if a new thumbnail is provided
        }, { new: true, runValidators: true });

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
