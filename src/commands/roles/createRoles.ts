import { ICommand } from '../../classes/Command';
import { guild_id } from '../../config';
import { RichEmbed, Message } from 'discord.js';
const customRoles = require('../../../customRoles.json')

export const command: ICommand = {
    name: "CreateRoles",
    description: "Create roles, DONT USE THIS COMMAND",
    perms: ["admin"],
    aliases: ["cr"],
    hidden: true,
    disabled: true,

    async execute(message, args) {
        const guild = message.client.guilds.get(guild_id)
        if (!guild) return
        const rolesChannel = guild.channels.get("628565019508080660")
        if (!rolesChannel) return

        const games = customRoles.sections.find(cr => cr.title === "Watching")
        const roles = games.roles

        const titleEmbed = new RichEmbed()
        titleEmbed.setTitle("Watching")
        titleEmbed.setColor(0xffffff)

        message.channel.send(titleEmbed)

        const embed = new RichEmbed()
        for (let i = 0; i < roles.length; i++) {
            const role = roles[i]
            embed.addField(role.name, "\u200b")
        }

        const msg = await message.channel.send(embed)

        for (let i = 0; i < roles.length; i++) {
            const role = roles[i]
            if (msg instanceof Message)
                await msg.react(role.emoji)
        }
    }
}