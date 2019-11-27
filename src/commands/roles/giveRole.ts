import { ICommand } from '../../classes/Command';
import { QuickEmbed } from '../../util/style';

export const command: ICommand = {
    name: "GiveRole",
    description: "Give a role to user",
    perms: ["admin"],
    aliases: ["give"],
    usage: "give <roleid> <roleid>",
    args: true,

    execute(message, args) {
        const selectedID = args.shift()
        const giveID = args.shift()

        if (!selectedID || !giveID) return QuickEmbed(message, "invalid arguments")

        const selectedRole = message.guild.roles.get(selectedID)
        const giveRole = message.guild.roles.get(giveID)

        if (!selectedRole) return QuickEmbed(message, `Selected Role [${selectedID}] not found`)
        if (!giveRole) return QuickEmbed(message, `Give Role [${giveID}] not found`)

        selectedRole.members.map(member => {
            member.addRole(giveRole)
        })
    }
}