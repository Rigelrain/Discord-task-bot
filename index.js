const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token, dbUsername, dbPassword, dbAddress } = require("./config.json");

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

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

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
        message.reply("there was an error trying to execute that command!");
    }
});

client.login(token);