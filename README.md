# Introduction
This bot is a helper-bot to be used in Discord. The bot can collect tasks to a MongoDB database, retrieve them by the user named for the task and delete the tasks from database if they are marked done.
More commands can be added by following the same structure as with the commands available.

# Table of Contents
* Prerequisites
* Config

# Prerequisites
You must have the following installed:
* Node.js
* Express (if it doesn't load with the dependencies, I'd recommend installing this globally)
* I'd also recommend installing nodemon (globally) especially if you plan to do a lot of Node projects

Also you need:
* MongoDB: personally I'd use mLab's sandbox plan for a small project, you could also install one locally if you want, although the code is set up for a connection to a cloud version

# Configuration
Use the *config-template.json* and make a copy of it in the same directory, then rename that copy as *config.json*. Fill in the necessary information:
* prefix: this is defaulted at '!', but you can use whatever command-prefix you want
* token: this is the token for your Discord-bot. For a very nice tutorial on how to set up your bot, see: discord.js.org
* dbUsername: the username for your MongoDB
* dbPassword: the password for the MongoDB
* dbAddress: the identifying part of your MongoDB address (copy-paste everything after the @-sign)

## Set up
Copy the project into the directory of your choosing. Open your terminal and get the dependencies through npm:
> npm install

# Build / Run

Starting the server:
> node index.js

Or using nodemon you can use:
> npm start