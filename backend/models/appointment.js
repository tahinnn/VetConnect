const mongoose = require('mongoose');
const validator = require('validator');

const appointmentSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'User name is required'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /^01[3-9]\d{8}$/.test(v);
            },
            message: props => `${props.value} is not a valid Bangladeshi phone number!`
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} is not a valid email!`
        }
    },
    petName: {
        type: String,
        required: [true, 'Pet name is required'],
        trim: true
    },
    petType: {
        type: String,
        required: [true, 'Pet type is required'],
        enum: ['Cat', 'Dog', 'Bird', 'Rabbit']
    },
    veterinaryType: {
        type: String,
        required: [true, 'Veterinary type is required'],
        enum: ['Expert', 'Regular checkup', 'Regular Vaccination', 'Spray']
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required'],
        validate: {
            validator: function(v) {
                return v > new Date();
            },
            message: 'Appointment date must be in the future'
        }
    },
    clinicPlace: {
        type: String,
        required: [true, 'Clinic place is required'],
        enum: ['Mirpur', 'Banani', 'Gulshan', 'Dhanmondi', 'Badda', 'Rampura', 'Uttara']
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 