const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    email: {
        type: String, 
        require: true
    }, 

    affair: {
        type: String,
        require: true
    },

    description: {
        type: String,
        require: true
    },

    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('contacts', ContactSchema);