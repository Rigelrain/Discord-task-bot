const Remind = require("../models/remindmodel.js");
const User = require("../models/usermodel.js");

module.exports = {
    execute() {
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
                            .select("-_id user message")
                            .exec());
                    }

                    return Promise.all(promises);
                }
            })
            .then(result => {
                const promises = [];

                for (let i = 0; i < result.length; i++) {

                    let output = "";

                    for (let j = 0; j < result[i].length; j++) {
                        output += result[i][j].message + "\n";
                    }

                    console.log("Reminders for user " + result[i][0].user + ": \n" + output);
                }

                return Promise.all(promises);
            })
            .catch(err => console.log("Error in finding users: " + err));
    },
};