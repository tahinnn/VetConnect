const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
    // User information
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pickupType: {
        type: String,
        enum: ['online', 'offline'],
        required: true
    },

    // Pet information
    pet: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Pet'
        },
        name: String,
        breed: String,
        age: Number,
        image: String
    },

    // Payment information
    paymentMethod: {
        type: String,
        enum: ['bkash', 'nagad', 'rocket'],
        required: true
    },
    transactionNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{11}$/.test(v);
            },
            message: props => `${props.value} is not a valid transaction number! Must be 11 digits.`
        }
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    adoptionFee: {
        type: Number,
        required: true
    },
    processingFee: {
        type: Number,
        required: true,
        default: 250
    },
    totalAmount: {
        type: Number,
        required: true
    },

    // Timestamps
    submissionDate: {
        type: Date,
        required: true
    },
    issuedDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Adoption = mongoose.model('Adoption', adoptionSchema);

module.exports = Adoption;
