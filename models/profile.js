const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    userinfo: {
        type: String,
        trim: true,
    },
    location: {
        type: String
    },
    aboutme: {
        type: String,
        required: true,
        trim: true,
        default: 'your careerer description'
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        trim: true,
        maxlength:10,
        unique: true
    },
    skills: [String],
    user: {
        type: ObjectId,
        ref: 'User'
    }
}, { timestamps: true });


module.exports = mongoose.model("Profile", profileSchema);