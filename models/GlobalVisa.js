const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for Pricing details
const PricingDetailSchema = new Schema({
    title: { type: String },
    amount: { type: Number},
    currency: { type: String}
}, { _id: false });



// Schema for FAQ
const FaqSchema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false });

// Schema for Visa Package
const VisaPackageSchema = new Schema({
    destinationOrTour: { type: String },
    living: { type: String },
    date: { type: String },
    nationality: { type: String}
}, { _id: false });



    // Schema for PricingWithCurrency
    const PricingWithCurrencySchema = new Schema({
        currency: { type: String },
        price: { type: Number },
        discountPrice: { type: Number },
        discountPercentage: { type: String },
    }, { _id: false });

// Main schema
const GlobalVisaSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: [{ type: String }],
    thumbnail: { type: String },
    details: { type: Schema.Types.Mixed },  // For flexibility, if `details` is a complex object
    faculty: [{ type: String }],
    howToApply: { type: String },
    overview: { type: String },
    options: [{
        title: { type: String },
        badge: { type: String },
        discount: { type: String },
        refundStatus: { type: String },
        processType: [{ type: String, enum: ["Low", "Medium", "High"] }],  // Enum for processType
        visaNo: [{ type:Number }],
        price: { type: Number },
        currency: { type: String },
        discountPercentage:{type: String},
        priceWithCurrency: [PricingWithCurrencySchema],//Optional if multiple currency comes
        visaPackage: [VisaPackageSchema], // Array of Visa Packages
        footerText: { type: String }
    }],
    pricing: {
        packageCost: [PricingDetailSchema],
        tax: [PricingDetailSchema]
    },
    faq: [FaqSchema],
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('GlobalVisa', GlobalVisaSchema);
