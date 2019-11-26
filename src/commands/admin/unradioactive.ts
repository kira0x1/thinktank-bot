import { ICommand } from '../../classes/Command';
import { adminEmbed, getRole, notFoundEmbed } from '../../util/adminUtil';

export const command: ICommand = {
    name: "Un-Radioactive",
    description: "Un-Rad a user",
    perms: ["admin"],
    usage: "[@user | id]",
    args: true,
    aliases: ["unrad"],

    async execute(message, args) {
        const query = args.shift()
        if (!query) return

        let member = message.mentions.members.first()

        if (!member) {
            member = await message.guild.fetchMember(query)
        }

        if (member) {

            const role = getRole(message, "629774319739863070")
            if (!role) return console.log(`could not find role radioactive`)

            //NOTE add role
            member.removeRole(role)

            //NOTE Send embed
            adminEmbed(message, member, "Un-Radioactive", args.join(" "))
        } else {
            notFoundEmbed(message, query)
        }
    }

}