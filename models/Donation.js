const mongoose = require("mongoose");

const User = require('../models/user'); // import User schema file

const { Schema } = mongoose;

const DonationRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: false
    },
    helpers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        ByMatching: {
            type: Boolean,
            required: true
        }
    }],
    media: {
        type: String,
        required: false
    },

}, {
    timestamps: true
});
module.exports = Donation = mongoose.model('donation', DonationRequestSchema);