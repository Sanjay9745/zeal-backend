const Holiday = require("../../models/Holiday");


module.exports.get = async (req, res) => {
    try {
        const Holidays = await Holiday.findAll();
        res.status(200).json({ success: true, results: Holidays });
    } catch (error) {
        res.status(500).json({ success: false, error: error, message: "Error Getting" })
    }
}

module.exports.add = async (req, res) => {
    try {
        
        const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].path : '';
        const pdfs = req.files['pdf'] ? req.files['pdf'].map(file => ({ type: 'application/pdf', link: file.path })) : [];

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
}

module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedHoliday = await Holiday.findByIdAndDelete(id);

        if (!deletedHoliday) {
            return res.status(404).json({ success: false, message: 'Holiday not found' });
        }

        res.status(200).json({ success: true, message: 'Holiday deleted successfully', data: deletedHoliday });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: 'Error deleting holiday' });
    }
};
