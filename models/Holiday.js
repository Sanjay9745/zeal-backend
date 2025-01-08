const mongoose = require('mongoose');
const { Schema } = mongoose;



// Schema for Itinerary details
const ItineraryDetailsSchema = new Schema({
    title: { type: String },
    image: { type: String },
    category: { type: String },
    location: { type: String },
    room: { type: String },
    checkIn: { type: String },
    checkout: { type: String }
}, { _id: false });

// Schema for Itinerary
const ItinerarySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    place: { type: String },
    dayDetails: { type: String },
    details: [ItineraryDetailsSchema]
}, { _id: false });

// Schema for Pricing details
const PricingDetailSchema = new Schema({
    title: { type: String },
    amount: { type: String },
    currency: { type: String }
}, { _id: false });

// Schema for Booking Policy
const PolicySchema = new Schema({
    title: { type: String },
    description: { type: String }
}, { _id: false });

// Schema for FAQ
const FaqSchema = new Schema({
    question: { type: String },
    answer: { type: String }
}, { _id: false });


// Main schema
const HolidaySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    slug: { type: String, required: true, unique: true },
    thumbnail: { type: String },
    details: Object,
    faculty: [{ type: String }],
    highlights: [{ type: String }],
    overview: { type: String },
    itinerary: [ItinerarySchema],
    tourOverview: { type: String },
    inclusion: [{ type: String }],
    exclusion: [{ type: String }],
    timings: [{
        title: { type: String },
        days: { type: String },
        time: { type: String }
    }],
    pricing: {
        title: { type: String },
        description: { type: String },
        packageCost: [PricingDetailSchema],
        tax: [PricingDetailSchema],
        totalAmount: { type: String }
    },
    bookingPolicy: {
        cancellation: [PolicySchema],
        childPolicy: [PolicySchema],
        otherPolicies: [PolicySchema] // To handle any additional dynamic policies
    },
    faq: [FaqSchema],
    additionalInfo: { type: String },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

// Export the model
module.exports = mongoose.model('Holiday', HolidaySchema);
