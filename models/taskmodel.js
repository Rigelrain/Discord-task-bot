// file: ../models/taskmodel.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// the schema for tasks
const taskSchema = new Schema({
    user: {type: String, required: true},
    task: String,
    ID: Number,
});

// model for tasks
module.exports = mongoose.model("task", taskSchema);