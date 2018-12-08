const Remind = require("../models/remindmodel.js");
const User = require("../models/usermodel.js");

module.exports = {
    name: "remind",
    description: "Sets a reminder for a given message and will alert you with it in PM daily until you react to it with a :thumbsup:, :+1: or :thumbup:",
    aliases: ["reminder", "remindme"],
    usage: "[message]",
    args: true,
    cooldown: 1,
    execute(message, args) {
        const user = message.author.username;

        // exit early on user-error
        if(!user) return message.reply("No user found, sorry!");

        // make and save the reminder to database
        const remind = new Remind({
            user: user,
            message: args.join(" "),
        });

        User.findOne({ user: user })
            .select("user")
            .exec()
            .then((doc) => {
                if (!doc) {
                    // user wasn't found, add it to the database
                    const newuser = new User({ user: user });

                    newuser.save((err) => {
                        if(err) console.log("Error when saving user: " + err);
                    });
                }
            })
            .catch(err => console.log(err));

        remind.save((err) => {
            if(err) {
                return message.reply("Something went wrong with adding the reminder: " + err);
            }

            return message.reply("I'll be sending you a reminder for this daily. Mark it done by reacting to it with a :thumbsup:");
        });
    },
};