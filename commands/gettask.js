const Task = require("../models/taskmodel.js");

module.exports = {
    name: "gettask",
    description: "Returns all tasks by given username.",
    aliases: ["fetchtask", "fetch", "getmytask"],
    usage: "[user]",
    args: true,
    cooldown: 1,
    execute(message, args) {
        const taskUser = args.shift();

        Task.find({ user: taskUser })
            .select("task ID")
            .exec((err, docs) => {
                if (err) {
                    return message.reply("Couldn't get your tasks, sorry!");
                }

                let output = "";
                for(const entry in docs) {
                    output += `ID ${docs[entry].ID}: ${docs[entry].task}\n`;
                }

                // console.log(output);
                return message.reply(`Here are the tasks for ${taskUser}:\n${output}`);
            });
    },
};