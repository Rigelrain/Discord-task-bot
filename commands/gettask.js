const Task = require("../models/taskmodel.js");

module.exports = {
    name: "gettask",
    description: "Returns all tasks by given username. If given 'ALL' as parameter, gets all tasks",
    aliases: ["fetchtask", "fetch", "getmytask"],
    usage: "[user]",
    args: true,
    cooldown: 1,
    execute(message, args) {
        const taskUser = args.shift();

        if(taskUser == "All") {
            // return all tasks
            Task.find({})
                .select("user task ID")
                .exec((err, docs) => {
                    if(err) {
                        return message.reply("Couldn't get the tasks, sorry!");
                    }

                    let output = "";
                    for(const entry in docs) {
                        output += `${docs[entry].user} - ID ${docs[entry].ID}: ${docs[entry].task}\n`;
                    }

                    // console.log(output);
                    return message.reply(`Here are the tasks for ${taskUser}:\n${output}`);

                });
        }
        else {
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
        }
    },
};