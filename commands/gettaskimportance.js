const Task = require("../models/taskmodel.js");

module.exports = {
    name: "gettaskimportance",
    description: "Returns all tasks by given importance: Critical, High, Medium, Minor",
    aliases: ["fetchimportance", "getimportance", "getpriority", "fetchpriority"],
    usage: "[importance]",
    args: true,
    cooldown: 1,
    execute(message, args) {
        const taskImportance = args.shift();
        const taskImportanceLowcase = taskImportance.toLowerCase();

        Task.find({ importance: taskImportanceLowcase })
            .select("user task deadline ID")
            .exec()
            .then((docs) => {
                let output = "";
                let outputChanged = false;

                for(const entry in docs) {
                    output += `ID ${docs[entry].ID}: ${docs[entry].user}, ${docs[entry].deadline}, ${docs[entry].task}\n`;
                    outputChanged = true;
                }

                if(outputChanged == true) {
                    // console.log(output);
                    return message.reply(`Here are the tasks for ${taskImportance}:\n${output}`, { split: true });
                }
                else {
                    return message.reply(`No ${taskImportance} tasks left.`);
                }
            })
            .catch((err) => {
                console.log(err);
                return message.reply("Couldn't get the tasks, sorry!");
            });
    },
};