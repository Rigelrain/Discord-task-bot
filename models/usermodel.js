// file: ../models/usermodel.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// the schema for tasks
const userSchema = new Schema({
    user: String,
});

// model for tasks
module.exports = mongoose.model("user", userSchema);