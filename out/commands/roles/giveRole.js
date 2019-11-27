"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var style_1 = require("../../util/style");
exports.command = {
    name: "GiveRole",
    description: "Give a role to user",
    perms: ["admin"],
    aliases: ["give"],
    usage: "give <roleid> <roleid>",
    args: true,
    execute: function (message, args) {
        var selectedID = args.shift();
        var giveID = args.shift();
        if (!selectedID || !giveID)
            return style_1.QuickEmbed(message, "invalid arguments");
        var selectedRole = message.guild.roles.get(selectedID);
        var giveRole = message.guild.roles.get(giveID);
        if (!selectedRole)
            return style_1.QuickEmbed(message, "Selected Role [" + selectedID + "] not found");
        if (!giveRole)
            return style_1.QuickEmbed(message, "Give Role [" + giveID + "] not found");
        selectedRole.members.map(function (member) {
            member.addRole(giveRole);
        });
    }
};
