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
    // console.log("Request :", req.body);

    try {
        const newUmraha = new UmrahaData({
            ...req.body
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
      const { updatePackage } = req.body;
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
