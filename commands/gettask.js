const Task = require("../models/taskmodel.js");

module.exports = {
    name: "gettask",
    description: "Returns all tasks by given username. If given 'ALL' as parameter, gets all tasks",
    aliases: ["fetchtask", "fetch", "getmytask"],
    usage: "[user]",
    args: true,
    cooldown: 1,
    execute(message, args) {
        const taskUser = args.shift().toLowerCase();
        // const taskUserLowcase = taskUser.toLowerCase();

        if(taskUser == "all") {
            // return all tasks
            Task.find({})
                .select("user task deadline importance ID")
                .lean()
                .exec()
                .then((docs) => {
                    let output = "";
                    for(const entry in docs) {
                        output += `${docs[entry].user.charAt(0).toUpperCase() + docs[entry].user.substr(1)} - ID ${docs[entry].ID} - ${docs[entry].deadline.charAt(0).toUpperCase() + docs[entry].deadline.substr(1)} - ${docs[entry].importance.charAt(0).toUpperCase() + docs[entry].importance.substr(1)}: ${docs[entry].task}\n`;
                    }

                    // console.log(output);
                    return message.reply(`Here are the tasks for All:\n${output}`, { split: true });

                })
                .catch((err) => {
                    console.log(err);
                    return message.reply("Couldn't get the tasks, sorry!")
                        .catch(err => console.log(err));
                });
        }
        else {
            Task.find({
                $or: [
                    { user: taskUser },
                    { user : "all" },
                ] })
                .select("user task deadline importance ID")
                .lean()
                .exec()
                .then((docs) => {
                    let output = "";
                    let outputChanged = false;

                    for(const entry in docs) {
                        if(docs[entry].user == "all") {
                            output += `For All - ID ${docs[entry].ID} - ${docs[entry].deadline.charAt(0).toUpperCase() + docs[entry].deadline.substr(1)} - ${docs[entry].importance.charAt(0).toUpperCase() + docs[entry].importance.substr(1)}: ${docs[entry].task}\n`;
                            outputChanged = true;
                        }
                        else {
                            output += `For ${docs[entry].user.charAt(0).toUpperCase() + docs[entry].user.substr(1)} - ID ${docs[entry].ID} - ${docs[entry].deadline.charAt(0).toUpperCase() + docs[entry].deadline.substr(1)} - ${docs[entry].importance.charAt(0).toUpperCase() + docs[entry].importance.substr(1)}: ${docs[entry].task}\n`;
                            outputChanged = true;
                        }
                    }

                    if(outputChanged == true) {
                        // console.log(output);
                        return message.reply(`Here are the tasks for ${taskUser.charAt(0).toUpperCase() + taskUser.substr(1)}:\n${output}`, { split: true });
                    }
                    else {
                        return message.reply("No tasks for you, good job!");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    return message.reply("Couldn't get the tasks, sorry!")
                        .catch(err => console.log(err));
                });
        }
    },
};