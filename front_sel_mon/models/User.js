const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    gender: String,
    hobbies: [String],
    email: String,
    phone: String,
    city: String,
    address: String,
    password: String
});

module.exports = mongoose.model("User", userSchema);