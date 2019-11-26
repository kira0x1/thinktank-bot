import { ICommand } from "../../classes/Command";
import { Role } from 'discord.js';
import { QuickEmbed } from "../../util/style";
import { persistenRoles } from '../../db/dbRole';
import { deleteRole } from "../../db/roleController";

export const command: ICommand = {
    name: "Un-PersistRole",
    description: "Un-Persist a role",
    usage: "[role name | role id]",
    args: true,
    perms: ["admin"],

    async execute(message, args) {
        const arg = args.shift()
        if (!arg) return

        let role: Role = message.guild.roles.find(rl => rl.name === arg || rl.id === arg)
        if (!role) return QuickEmbed(message, `Role ${arg} not found`)

        if (persistenRoles.has(role.id)) {
            deleteRole(role.id).then(() => {
                console.log(`Deleted role from persistance ${role.name}`)
                persistenRoles.delete(role.id)
            }).catch(err => console.error(err))
            QuickEmbed(message, `${role.name} is removed`)
        } else {
            QuickEmbed(message, `${role.name} is not persistent`)
        }
    }
}