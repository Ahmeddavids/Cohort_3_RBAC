const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean
    },
    stack: {
        type: String,
        enum: ['Backend', 'Frontend'],
        require: true
    },
    role: {
        type: String,
        enum: ['Teacher', 'Student'],
        require: true
    },
    score: {
        html: {
        type: Number,
        },
        node: {
        type: Number,
        },
        css: {
        type: Number,
        },
        javaScript: {
        type: Number,
        }
    },
    blackList: {
        type: Array,
        default: []
    }
}, {timestamps: true});

const User = mongoose.model('Users', userSchema);

module.exports = User