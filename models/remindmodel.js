// file: ../models/remindmodel.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// the schema for tasks
const remindSchema = new Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
});

// model for tasks
module.exports = mongoose.model("remind", remindSchema);