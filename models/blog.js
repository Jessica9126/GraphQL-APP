const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    owner: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isliked: {
        type: Boolean,
        required: false
    },
    picture: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('Blog', blogSchema);