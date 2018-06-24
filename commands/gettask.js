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
        const taskUserLowcase = taskUser.toLowerCase();

        if(taskUserLowcase == "all") {
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
            Task.find({
                $or: [
                    { user: taskUserLowcase },
                    { user : "all" },
                ] })
                .select("user task ID")
                .exec((err, docs) => {
                    if (err) {
                        return message.reply("Couldn't get your tasks, sorry!");
                    }

                    let output = "";
                    let outputChanged = false;

                    for(const entry in docs) {
                        if(docs[entry].user == "all") {
                            output += `For All: ID ${docs[entry].ID}: ${docs[entry].task}\n`;
                            outputChanged = true;
                        }
                        else {
                            output += `For ${taskUser}: ID ${docs[entry].ID}: ${docs[entry].task}\n`;
                            outputChanged = true;
                        }
                    }

                    if(outputChanged == true) {
                        // console.log(output);
                        return message.reply(`Here are the tasks for ${taskUser}:\n${output}`);
                    }
                    else {
                        return message.reply("No tasks for you, good job!");
                    }
                });
        }
    },
};