import { ICommand } from '../../classes/Command';
import { adminEmbed, getRole, notFoundEmbed } from '../../util/adminUtil';

export const command: ICommand = {
    name: "UnTextMute",
    description: "Un-Text mute a user",
    usage: "[@user | id]",
    aliases: ["untxtmute", "untxtmute", "unmutet", "unmutetxt"],
    perms: ["admin", "mod", "demi-mod"],
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

            //NOTE remove textmute role
            member.removeRole(role)

            //NOTE Send embed
            adminEmbed(message, member, "Un-Text Mute", args.join(" "))
        } else {
            notFoundEmbed(message, query)
        }
    }
}