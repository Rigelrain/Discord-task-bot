const Task = require("../models/taskmodel.js");

module.exports = {
    name: "gettaskdeadline",
    description: "Returns all tasks by given deadline",
    aliases: ["fetchdeadline", "getdeadline"],
    usage: "[importance]",
    args: true,
    cooldown: 1,
    execute(message, args) {
        const taskDeadline = args.shift();
        const taskDeadlineLowcase = taskDeadline.toLowerCase();

        Task.find({ deadline: taskDeadlineLowcase })
            .select("user task importance ID")
            .lean()
            .exec()
            .then((docs) => {
                let output = "";
                let outputChanged = false;

                for(const entry in docs) {
                    output += `ID ${docs[entry].ID}: ${docs[entry].user}, ${docs[entry].importance}, ${docs[entry].task}\n`;
                    outputChanged = true;
                }

                if(outputChanged == true) {
                    // console.log(output);
                    return message.reply(`Here are the tasks for ${taskDeadline}:\n${output}`, { split: true });
                }
                else {
                    return message.reply(`No ${taskDeadline} tasks left.`);
                }
            })
            .catch((err) => {
                console.log(err);
                return message.reply("Couldn't get the tasks, sorry!");
            });
    },
};