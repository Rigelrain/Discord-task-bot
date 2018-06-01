// file: ../models/taskmodel.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// the schema for tasks
const counterSchema = new Schema({
    _id: {type: String, required: true},
    COUNT: Number,
    NOTES: String
});

// model for tasks
module.exports = mongoose.model("counter", counterSchema);