const Holiday = require("../../models/Holiday");

// Get all Holidays (with optional pagination)
module.exports.get = async (req, res) => {
    try {
        const { page, perPage } = req.query;

        let holidays;
        if (page && perPage) {
            const total = await Holiday.countDocuments();
            holidays = await Holiday.find()
                .skip((page - 1) * perPage)
                .limit(parseInt(perPage));

            return res.status(200).json({
                success: true,
                results: holidays,
                page: parseInt(page),
                perPage: parseInt(perPage),
                total,
                totalPages: Math.ceil(total / perPage)
            });
        } else {
            holidays = await Holiday.find();
            return res.status(200).json({
                success: true,
                results: holidays
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
        const holiday = await Holiday.findById(id);

        if (!holiday) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        res.status(200).json({ success: true, results: holiday });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting Holiday" });
    }
};

// Add a new Holiday
module.exports.add = async (req, res) => {
    try {
        // Get images from files or fallback to req.body
        const images = req.files && req.files['images'] 
            ? req.files['images'].map(file => file.path) 
            : req.body.images ? JSON.parse(req.body.images) : [];
        
        // Get thumbnail from files or fallback to req.body
        const thumbnail = req.files && req.files['thumbnail'] 
            ? req.files['thumbnail'][0].path 
            : req.body.thumbnail || '';
        
        // Get PDFs from files or fallback to req.body
        const pdfs = req.files && req.files['pdf'] 
            ? req.files['pdf'].map(file => ({ type: 'application/pdf', link: file.path })) 
            : req.body.pdfs ? JSON.parse(req.body.pdfs) : [];

        const newHoliday = new Holiday({
            ...req.body,
            images: images,
            thumbnail: thumbnail,
            pdf: pdfs
        });

        const savedHoliday = await newHoliday.save();

        res.status(200).json({ success: true, results: savedHoliday });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message, message: "Error adding holiday" });
    }
};


// Update an existing Holiday by ID
module.exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].path : '';
        const pdfs = req.files['pdf'] ? req.files['pdf'].map(file => ({ type: 'application/pdf', link: file.path })) : [];

        const updatedHoliday = await Holiday.findByIdAndUpdate(
            id,
            {
                ...req.body,
                images: images.length ? images : req.body.images,
                thumbnail: thumbnail || req.body.thumbnail,
                pdf: pdfs.length ? pdfs : req.body.pdf
            },
            { new: true }
        );

        if (!updatedHoliday) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        res.status(200).json({ success: true, results: updatedHoliday });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message, message: "Error updating Holiday" });
    }
};

// Delete a Holiday by ID
module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedHoliday = await Holiday.findByIdAndDelete(id);

        if (!deletedHoliday) {
            return res.status(404).json({ success: false, message: "Holiday not found" });
        }

        res.status(200).json({ success: true, message: "Holiday deleted successfully", data: deletedHoliday });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error deleting Holiday" });
    }
};
