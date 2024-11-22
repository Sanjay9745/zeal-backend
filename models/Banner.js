const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  imageUrls: {
    type: [String],
    required: true,
  },

  createDate: {
    type: Date,
    default: Date.now,
  },
});
   
// Export the model
module.exports = mongoose.model('banner', bannerSchema);
