const Model = require('../../models/model'); // Import your Mongoose model

module.exports.add = async (req, res) => {
    try {
        // Extract data from the request body
        const { name, number } = req.body;

        // Create a new document using the Model
        const newModelData = new Model({
            name,
            number
        });

        // Save the new document to MongoDB
        const savedData = await newModelData.save();

        // Send a success response with the saved data
        res.status(201).json({
            message: 'Data saved successfully',
            data: savedData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while saving data',
            error: error.message
        });
    }
};
