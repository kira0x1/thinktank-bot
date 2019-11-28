import chalk from 'chalk';
import { RichEmbed } from 'discord.js';
import { ICommand } from '../../classes/Command';
import { getRole, notFoundEmbed } from '../../util/adminUtil';
import { embedColor } from '../../util/style';

export const command: ICommand = {
    name: 'Un-Retreat',
    description: 'Removes retreat permissions from user',
    aliases: ['unrt', 'unr', 'unretreat'],
    usage: '[@user | id]',
    perms: ['admin', 'retreat-manager'],
    args: true,

    async execute(message, args) {
        const query = args.shift();
        if (!query) return;

        let user = message.mentions.users.first();
        let member = (await message.guild.fetchMember(user.id)) || (await message.guild.fetchMember(query));

        if (member) {
            const role = getRole(message, '648273951180455947');
            if (!role) return console.log(chalk.bgRed.bold(`Couldnt find role retreater`));

            member.removeRole(role);

            //Create embed to tell user
            const embed = new RichEmbed()
                .setColor(embedColor)
                .addField('Removed Retreat Perms!', '```yaml\n' + member.displayName + ' can no longer enter the retreat!\n```');

            //Send embed
            message.channel.send(embed);
        } else {
            //Send feedback if the user was not found
            notFoundEmbed(message, query);
        }
    }
};
