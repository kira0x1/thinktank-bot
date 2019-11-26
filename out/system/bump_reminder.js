"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var ms_1 = __importDefault(require("ms"));
var config_1 = require("../config");
var chalk_1 = __importDefault(require("chalk"));
var disboardId = "302050872383242240";
var timer;
var bumpChannelId = "635469422869348392";
function OnMessageBot(message) {
    if (message.author.id !== disboardId || message.guild.id !== config_1.guild_id)
        return;
    var description = message.embeds[0].description;
    var args = description.split(" ");
    args.shift();
    var firstWord = args.shift();
    //Failed
    if (firstWord === "Please") {
        var time = args[2];
        SetReminder(message, time + "m");
    }
    else { //Success
        SetReminder(message, "2h");
    }
}
exports.OnMessageBot = OnMessageBot;
function SetReminder(message, time) {
    if (timer) {
        clearTimeout(timer);
    }
    console.log(chalk_1.default.bgBlue.bold("Set bump reminder for " + time));
    timer = setTimeout(function () {
        var guild = message.client.guilds.get(config_1.guild_id);
        if (guild) {
            var channel = guild.channels.get(bumpChannelId);
            if (!channel)
                return;
            if (channel instanceof discord_js_1.TextChannel) {
                channel.send("@here Reminder to bump \uD83D\uDC96");
            }
        }
    }, ms_1.default(time));
}
