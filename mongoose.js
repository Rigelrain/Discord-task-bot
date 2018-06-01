/* const { dbUsername, dbPassword, dbAddress } = require("./config.json");
const mongoose = require("mongoose");
const mongoDB = `mongodb://${dbUsername}:${dbPassword}@${dbAddress}`;
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error: "));

 */