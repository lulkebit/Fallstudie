const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: String,
    firstname: String,
    lastname: String,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
