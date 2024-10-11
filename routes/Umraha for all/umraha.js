const UmrahaData = require("../../models/umraha");

// Get all Holidays (with optional pagination)
module.exports.get = async (req, res) => {
    try {
        const { page, perPage } = req.query;

        let UmrahaforAll;
        if (page && perPage) {
            const total = await UmrahaData.countDocuments();
            UmrahaforAll = await UmrahaData.find()
                .skip((page - 1) * perPage)
                .limit(parseInt(perPage));

            return res.status(200).json({
                success: true,
                results: UmrahaforAll,
                page: parseInt(page),
                perPage: parseInt(perPage),
                total,
                totalPages: Math.ceil(total / perPage)
            });
        } else {
            UmrahaforAll = await UmrahaData.find();
            return res.status(200).json({
                success: true,
                results: UmrahaforAll
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting Holidays" });
    }
};

// Get a single Holiday by ID
module.exports.getSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const UmrahaforAll = await UmrahaData.findById(id);

        if (!UmrahaforAll) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        res.status(200).json({ success: true, results: UmrahaforAll });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting Holiday" });
    }
};

// Add a Umrha
module.exports.add = async (req, res) => {
    try {
        // Get images from files or fallback to req.body
        const images = req.files && req.files['images']    
            ? req.files['images'].map(file => file.path) 
            : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);
        
        // Get thumbnail from files or fallback to req.body
        const thumbnail = req.files && req.files['thumbnail'] 
            ? req.files['thumbnail'][0].path 
            : (req.body.thumbnail || '');
        
        // Get PDFs from files or fallback to req.body
        const pdfs = req.files && req.files['pdf'] 
            ? req.files['pdf'].map(file => ({ type: 'application/pdf', link: file.path })) 
            : (req.body.pdfs && typeof req.body.pdfs === 'string' ? JSON.parse(req.body.pdfs) : []);

        const newUmraha = new UmrahaData({
            ...req.body,
            images: images,
            thumbnail: thumbnail,
            pdf: pdfs
        });

        const savedUmraha = await newUmraha.save();

        res.status(200).json({ success: true, results: savedUmraha });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message, message: "Error adding holiday" });
    }
};


// Update an existing Holiday by ID
module.exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        const images = req.files && req.files['images'] 
            ? req.files['images'].map(file => file.path) 
            : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);
        
        const thumbnail = req.files && req.files['thumbnail'] 
            ? req.files['thumbnail'][0].path 
            : (req.body.thumbnail || '');
        
        const pdfs = req.files && req.files['pdf'] 
            ? req.files['pdf'].map(file => ({ type: 'application/pdf', link: file.path })) 
            : (req.body.pdfs && typeof req.body.pdfs === 'string' ? JSON.parse(req.body.pdfs) : []);

        const updatedUmraha = await UmrahaData.findByIdAndUpdate(
            id,
            {
                ...req.body,
                images: images.length ? images : req.body.images,
                thumbnail: thumbnail || req.body.thumbnail,
                pdf: pdfs.length ? pdfs : req.body.pdf
            },
            { new: true }
        );

        if (!updatedUmraha) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        res.status(200).json({ success: true, results: updatedUmraha });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message, message: "Error updating Holiday" });
    }
};

// Delete a Holiday by ID
module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUmraha = await UmrahaData.findByIdAndDelete(id);

        if (!deletedUmraha) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        res.status(200).json({ success: true, message: "Holiday deleted successfully", data: deletedUmraha });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error deleting Holiday" });
    }
};
