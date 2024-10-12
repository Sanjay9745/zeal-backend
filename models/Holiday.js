const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for PDF links
const PdfSchema = new Schema({
    type: { type: String },
    link: { type: String }
});

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

// Schema for Ratings
const RatingSchema = new Schema({
    reviews: [{ type: String }], // Array of review strings or a more complex object
    stars: { type: String, default:"4.0"},
    ratingCount: { type: String, default: "0" },
    review: { type: String },
    details: [{}]
}, { _id: false });

// Main schema
const HolidaySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    slug: { type: String, required: true, unique: true },
    thumbnail: { type: String },
    pdf: [PdfSchema],
    details: Object,
    /* {
     share: { type: String },
     fcb: { type: String },
     from: { type: String },
     to: { type: String },
     duration: { type: String },
     date: { type: String },
     price: { type: String },
     discount: { type: String },
     discountPrice: { type: String },
     discountPercentage: { type: String }
     tags: [{ type: String }],
 }*/
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
        packageCost: [],
        tax: [],
        totalAmount: { type: String }
    },
    bookingPolicy: {
        cancellation: {},
        childPolicy: {},
        otherPolicies: [] // To handle any additional dynamic policies
    },
    faq: [FaqSchema],
    rating: RatingSchema,
    additionalInfo: { type: String },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

// Export the model
module.exports = mongoose.model('Holiday', HolidaySchema);
