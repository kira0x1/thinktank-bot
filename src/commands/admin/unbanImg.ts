import { ICommand } from "../../classes/Command";
import { adminEmbed, getRole, notFoundEmbed } from '../../util/adminUtil';

export const command: ICommand = {
    name: "allowImg",
    description: "Allows a user to post images | Removes the banimg role",
    usage: "[@user | id]",
    args: true,
    perms: ["admin", "mod", "demi-mod"],
    aliases: ["unbanimg", "unmuteimg"],

    async execute(message, args) {
        const query = args.shift()
        if (!query) return

        let member = message.mentions.members.first()

        if (!member) {
            member = await message.guild.fetchMember(query)
        }

        if (member) {
            //Get img perm denied role
            const role = getRole(message, "629774109655695370")

            if (!role) return console.log(`could not find role jail`)
            //NOTE Remove role
            member.removeRole(role)

            //NOTE Send embed
            adminEmbed(message, member, "Allow Image Posting", args.join(" "))
        } else {
            notFoundEmbed(message, query)
        }
    }
}