const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A name is required'],
    },
    email: {
        type: String, 
        required: true,
        unique: [true, 'An email address is mandatory']
    },
    role: {
        type: String
    }, 
    active: {
        type: Boolean,
        required: [true, 'Please specify if the profile is active or not']
    },
    photo: {},
    password: {
        type: String, 
        required: [true, 'An account must have a password']
    }
}); 

const User = mongoose.model('User', userSchema); 

module.exports = User; 