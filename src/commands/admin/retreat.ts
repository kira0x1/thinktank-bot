import chalk from 'chalk';
import { RichEmbed } from 'discord.js';
import { ICommand } from '../../classes/Command';
import { getRole, notFoundEmbed } from '../../util/adminUtil';
import { embedColor } from '../../util/style';

export const command: ICommand = {
    name: "Retreat",
    description: "Send a user to the retreat",
    aliases: ["rt"],
    usage: "[@user | id]",
    perms: ["admin", "retreat-manager"],
    args: true,

    async execute(message, args) {
        const query = args.shift()
        if (!query) return

        let user = message.mentions.users.first()
        let member = await message.guild.fetchMember(user.id) || await message.guild.fetchMember(query)

        if (member) {
            const role = getRole(message, "648273951180455947")
            if (!role) return console.log(chalk.bgRed.bold(`Couldnt find role retreater`))

            member.addRole(role)

            const embed = new RichEmbed()
                .setColor(embedColor)
                .addField("Battle Start!", "```yaml\n" + member.displayName + " has retreated!\n```")

            message.channel.send(embed)
        } else {
            notFoundEmbed(message, query)
        }
    }
}