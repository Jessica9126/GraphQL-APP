const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userinfoSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('UserInfo', userinfoSchema);