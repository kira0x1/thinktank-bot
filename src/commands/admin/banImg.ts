import { ICommand } from "../../classes/Command";
import { adminEmbed, getRole, notFoundEmbed } from '../../util/adminUtil';

export const command: ICommand = {
    name: "banImg",
    description: "bans a user from posting images",
    usage: "[@user | id]",
    args: true,
    perms: ["admin", "mod"],
    aliases: ["muteimg"],

    //FIXME CHANGE ROLES
    async execute(message, args) {
        const query = args.shift()
        if (!query) return

        let member = message.mentions.members.first()

        if (!member) {
            member = await message.guild.fetchMember(query)
        }

        if (member) {

            const role = getRole(message, "629774109655695370")
            if (!role) return console.log(`could not find role jail`)

            //NOTE add role
            member.addRole(role)

            //NOTE Send embed
            adminEmbed(message, member, "Image perm denied", args.join(" "))
        } else {
            notFoundEmbed(message, query)
        }
    }
}