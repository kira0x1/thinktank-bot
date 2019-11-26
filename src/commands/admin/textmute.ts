import { ICommand } from '../../classes/Command';
import { adminEmbed, getRole, notFoundEmbed } from '../../util/adminUtil';

export const command: ICommand = {
    name: "TextMute",
    description: "Text mute a user",
    usage: "[@user | id]",
    aliases: ["tmute", "txtmute", "mutet", "mutetxt"],
    perms: ["admin", "demi-mod", "mod"],
    args: true,

    async execute(message, args) {
        const query = args.shift()
        if (!query) return

        let member = message.mentions.members.first()

        if (!member) {
            member = await message.guild.fetchMember(query)
        }

        if (member) {
            const role = getRole(message, "629774106648379402")
            if (!role) return console.log(`could not find role jail`)

            //NOTE Add textmute role
            member.addRole(role)

            //NOTE Send embed
            adminEmbed(message, member, "Text Mute", args.join(" "))
        } else {
            notFoundEmbed(message, query)
        }
    }
}