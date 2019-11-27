"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var style_1 = require("../../util/style");
exports.command = {
    name: "RemoveRole",
    description: "Give a role to user",
    perms: ["admin"],
    aliases: ["roleremove"],
    usage: "removerole <roleid> <roleid>",
    args: true,
    execute: function (message, args) {
        var selectedID = args.shift();
        var removeID = args.shift();
        if (!selectedID || !removeID)
            return style_1.QuickEmbed(message, "invalid arguments");
        var selectedRole = message.guild.roles.get(selectedID);
        var removeRole = message.guild.roles.get(removeID);
        if (!selectedRole)
            return style_1.QuickEmbed(message, "Selected Role [" + selectedID + "] not found");
        if (!removeRole)
            return style_1.QuickEmbed(message, "Remove Role [" + removeID + "] not found");
        selectedRole.members.map(function (member) {
            member.removeRole(removeRole);
        });
    }
};
