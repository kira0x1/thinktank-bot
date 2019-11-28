"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var style_1 = require("../../util/style");
exports.command = {
    name: 'GiveRole',
    description: 'Give a role to users with a specific role',
    perms: ['admin'],
    aliases: ['give'],
    usage: 'give <roleid> <roleid>',
    args: true,
    execute: function (message, args) {
        var selectedID = args.shift();
        var giveID = args.shift();
        //If user didnt give correct amount of inputs return
        if (!selectedID || !giveID) {
            return style_1.QuickEmbed(message, 'invalid arguments');
        }
        //Get Roles by ID
        var selectedRole = message.guild.roles.get(selectedID);
        var giveRole = message.guild.roles.get(giveID);
        //If the selected role wasnt found, tell the user and exit out
        if (!selectedRole) {
            return style_1.QuickEmbed(message, "Selected Role [" + selectedID + "] not found");
        }
        //If the role wasnt found, tell the user and exit out
        if (!giveRole) {
            return style_1.QuickEmbed(message, "Give Role [" + giveID + "] not found");
        }
        //Add role to members with the selected role
        selectedRole.members.map(function (member) {
            member.addRole(giveRole);
        });
    }
};
