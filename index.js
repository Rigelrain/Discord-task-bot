const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token, dbUsername, dbPassword, dbAddress } = require("./config.json");
// const reminder = require("./js/sendreminder");

// mongoose models
const Remind = require("./models/remindmodel.js");
const User = require("./models/usermodel.js");

/**
 * const prefix = process.env.PREFIX;
 * const token = process.env.TOKEN;
 * const dbUsername = process.env.DB_USERNAME;
 * const dbPassword = process.env.DB_PASSWORD;
 * const dbAddress = process.env.DB_ADDRESS;
*/

// create app
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// database
const mongoose = require("mongoose");
const mongoDB = "mongodb://" + dbUsername + ":" + dbPassword + "@" + dbAddress;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
// end of database shenanigans

// commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}
// end commands

// sending reminders
let reminders = [];
const interval = 86400000;

setTimeout(findReminders, interval);
setInterval(sendReminders, interval);

function findReminders() {
    // clear out previous reminders
    reminders = [];
    User.find({})
        .select("-_id user")
        .lean()
        .exec()
        .then(docs => {
            if(docs.length == 0) {
                console.log("No users found.");
                return Promise.reject();
            }
            else {
                const promises = [];

                for(let i = 0; i < docs.length; i++) {
                    promises.push(Remind.find({ user: docs[i].user })
                        .select("_id user message")
                        .exec());
                }

                return Promise.all(promises);
            }
        })
        .then(result => {
            const promises = [];

            for (let i = 0; i < result.length; i++) {
                reminders.push({ user: result[i][0].user, messages: [] });

                for (let j = 0; j < result[i].length; j++) {
                    reminders[i].messages.push({ id: result[i][j]._id, message: result[i][j].message });
                }
            }

            console.log("reminders after setting: ");
            console.log(reminders);

            return Promise.all(promises);
        })
        .catch(err => console.log("Error in finding users: " + err));
}

function sendReminders() {
    // exit early if no reminders
    if(reminders.length == 0) { return; }

    for (let i = 0; i < 1; i++) {
        const remindUser = client.users.find("username", reminders[i].user);

        const filter = (reaction, user) => {
            return reaction.emoji.name === "👍" && user.id === remindUser.id;
        };

        for (let j = 0; j < reminders[i].messages.length; j++) {
            remindUser.send(`Just to remind you: ${reminders[i].messages[j].message} \nMark this done by reacting with a :thumbsup:!`, { split: true })
                .then(msg => {
                    return msg.awaitReactions(filter, { max: 1, time: interval - 10000, errors: ["time"] });
                })
                .then(() => {
                    // delete the reminder from database
                    console.log("This reminder with ID "
                        + reminders[i].messages[j].id
                        + "will be deleted: "
                        + reminders[i].messages[j].message);
                    return Remind.findByIdAndDelete(reminders[i].messages[j].id);
                })
                .then(() => {
                    console.log("Reminder deleted successfully!");
                })
                .catch(err => console.log("Error in reminder handling: " + err));
        }
    }
}
// end reminder shenanigans

// startup
client.on("ready", () => {
    console.log("Ready!");
});

// handle msg input
client.on("message", message => {
    // don't listen to anything not tagged with the prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // extract the command's name as the
    // first word of the string after prefix
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // get the command from the file's execute()
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // if no such command exist, don't do anything
    if (!command) return;

    // if command can only be used in chat
    // commandfile has property "guildOnly" = true
    if (command.guildOnly && message.channel.type !== "text") {
        return message.reply("I can't execute that command inside DMs!");
    }

    // if command requires arguments
    // commandfile has property "args" = true
    if (command.args && !args.length) {
        let reply = "You didn't provide any arguments, " + message.author + "!";

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    // execute the command -> execute()
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply("There was an error trying to execute that command!");
    }
});

client.login(token);