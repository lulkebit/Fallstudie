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
    goals: [
        {
            id: Number,
            title: String,
            categorie: String,
            startDate: Date,
            endDate: Date,
            public: Boolean,
            targetValue: Number,
            unit: String,
            direction: String,
            reminderInterval: Number,
            reminderType: String,
            progress: Number,
            description: String,
        },
    ],
    avatar: {
        type: String,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
