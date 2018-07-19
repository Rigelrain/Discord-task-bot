const Task = require("../models/taskmodel.js");

module.exports = {
    name: "done",
    description: "Deletes a task from database.",
    aliases: ["donetask", "finished", "finishedtask"],
    usage: "[task ID]",
    args: true,
    cooldown: 1,
    execute(message, args) {
        const taskID = parseInt(args.shift());

        Task.findOneAndDelete({ ID: taskID })
            .exec()
            .then(() => {
                // console.log("Deleted:" + docs);

                return message.reply("Task marked as done and deleted from database!");
            })
            .catch((err) => {
                console.log(err);
                return message.reply("Couldn't check that task as done, sorry!");
            });
    },
};