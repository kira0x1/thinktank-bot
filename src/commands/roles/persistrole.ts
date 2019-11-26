import { ICommand } from "../../classes/Command";
import { Role } from 'discord.js';
import { QuickEmbed } from "../../util/style";
import { persistenRoles } from '../../db/dbRole';
import { addRole } from "../../db/roleController";

export const command: ICommand = {
    name: "PersistRole",
    description: "Persist a role",
    usage: "[role name | role id]",
    args: true,
    perms: ["admin"],

    async execute(message, args) {
        const arg = args.shift()
        if (!arg) return

        let role: Role = message.guild.roles.find(rl => rl.name === arg || rl.id === arg)
        if (!role) return QuickEmbed(message, `Role ${arg} not found`)

        if (persistenRoles.has(role.id)) {
            QuickEmbed(message, `${role.name} is already persistent`)
        } else {
            QuickEmbed(message, `${role.name} is now persistent`)
            addRole({ name: role.name, roleId: role.id })
                .then(() => {
                    persistenRoles.set(role.name, { name: role.name, roleId: role.id })
                })
                .catch(err => console.error(err))
        }
    }
}