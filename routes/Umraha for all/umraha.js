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


// Fetch data by slug
module.exports.getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await UmrahaData.findOne({ slug });

        if (!data) {
            return res.status(404).json({ success: false, message: "Umrah data not found" });
        }

        res.status(200).json({ success: true, results: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error fetching Umrah data" });
    }
};

// Get a single Holiday by ID
module.exports.getSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const UmrahaforAll = await UmrahaData.findById(id);
console.log(UmrahaforAll);

        if (!UmrahaforAll) {
            return res.status(404).json({ success: false, message: "Umraha Data not found" });
        }

        res.status(200).json({ success: true, results: UmrahaforAll });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: "Error Getting Umraha" });
    }
};

// Add a Umrha

const BASE_URL = 'http://localhost:3002/uploads';

module.exports.add = async (req, res) => {
    console.log("fay");
    
    console.log("Requestimage :", req.body );

    try {

        const images = req.files && req.files['images']
            ? req.files['images'].map(file => `${BASE_URL}/images/${file.filename.replace(/\\/g, '/')}`) // Use forward slashes
            : (req.body.images && typeof req.body.images === 'string' ? JSON.parse(req.body.images) : []);

        console.log(req.files, "farhan");

        const thumbnail = req.files && req.files['thumbnail']
            ? `${BASE_URL}/thumbnails/${req.files['thumbnail'][0].filename.replace(/\\/g, '/')}` // Use forward slashes
            : (req.body.thumbnail || '');

            
        const detailsImage = req.files && req.files['detailsImage']
        ? `${BASE_URL}/detailsImage/${req.files['detailsImage'][0].filename.replace(/\\/g, '/')}` // Use forward slashes
        : (req.body.detailsImage || '');

        const itinerary = JSON.parse(req.body.itinerary)
        itinerary.details = itinerary.details.map((detail) => ({
            ...detail,
            detailsImage: detailsImage || '', 
          }));        


        const newUmraha = new UmrahaData({
            ...req.body,
            images: images,
            thumbnail: thumbnail,
            bookingPolicy: JSON.parse(req.body.bookingPolicy),
            faq: JSON.parse(req.body.faq),
            pricing: JSON.parse(req.body.pricing),
            itinerary: itinerary,
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
        const updatePackage = req.body;
        console.log(updatePackage);

        const updatedUmraha = await UmrahaData.findByIdAndUpdate(
            id,
            { ...updatePackage }, // Spread the updatePackage fields
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, results: updatedUmraha });
        console.log("Update successful");

    } catch (error) {
        console.error("Error during update:", error);
        res.status(500).json({ success: false, message: "Error updating Holiday", error: error.message });
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
