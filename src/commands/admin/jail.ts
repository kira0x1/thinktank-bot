import { GuildMember } from 'discord.js';
import { ICommand } from "../../classes/Command";
import { adminEmbed, getRole, notFoundEmbed } from '../../util/adminUtil';

export const command: ICommand = {
    name: "jail",
    description: "Jail a user",
    usage: "[@user | id]",
    args: true,
    perms: ["admin", "Mod", "demi-mod"],

    async execute(message, args) {
        const query = args.shift()
        if (!query) return

        let member = message.mentions.members.first()

        if (!member) {
            member = await message.guild.fetchMember(query)
        }

        if (member) {
            const role = getRole(message, "629774234154958868")
            if (!role) return console.log(`could not find role jail`)

            //NOTE Add jail role
            member.addRole(role)

            //NOTE Send embed
            adminEmbed(message, member, "Jailed", args.join(" "))
        } else {
            notFoundEmbed(message, query)
        }
    }
}