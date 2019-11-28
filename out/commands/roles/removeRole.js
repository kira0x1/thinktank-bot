"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var style_1 = require("../../util/style");
exports.command = {
    name: 'RemoveRole',
    description: 'Remove a role from users with a specific role',
    perms: ['admin'],
    aliases: ['roleremove'],
    usage: 'removerole <roleid> <roleid>',
    args: true,
    execute: function (message, args) {
        var selectedID = args.shift();
        var removeID = args.shift();
        //If user didnt give correct amount of inputs return
        if (!selectedID || !removeID) {
            return style_1.QuickEmbed(message, 'invalid arguments');
        }
        //Get Roles by ID
        var selectedRole = message.guild.roles.get(selectedID);
        var removeRole = message.guild.roles.get(removeID);
        //If the selected role wasnt found, tell the user and exit out
        if (!selectedRole) {
            return style_1.QuickEmbed(message, "Selected Role [" + selectedID + "] not found");
        }
        //If the role wasnt found, tell the user and exit out
        if (!removeRole) {
            return style_1.QuickEmbed(message, "Remove Role [" + removeID + "] not found");
        }
        //Remove the role from users with a specific role
        selectedRole.members.map(function (member) {
            member.removeRole(removeRole);
        });
    }
};
