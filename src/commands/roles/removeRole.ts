import { ICommand } from '../../classes/Command';
import { QuickEmbed } from '../../util/style';

export const command: ICommand = {
    name: "RemoveRole",
    description: "Remove a role from users with a specific role",
    perms: ["admin"],
    aliases: ["roleremove"],
    usage: "removerole <roleid> <roleid>",
    args: true,

    execute(message, args) {
        const selectedID = args.shift()
        const removeID = args.shift()

        if (!selectedID || !removeID) return QuickEmbed(message, "invalid arguments")

        const selectedRole = message.guild.roles.get(selectedID)
        const removeRole = message.guild.roles.get(removeID)

        if (!selectedRole) return QuickEmbed(message, `Selected Role [${selectedID}] not found`)
        if (!removeRole) return QuickEmbed(message, `Remove Role [${removeID}] not found`)

        selectedRole.members.map(member => {
            member.removeRole(removeRole)
        })
    }
}