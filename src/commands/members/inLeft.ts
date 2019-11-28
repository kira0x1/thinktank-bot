import { ICommand } from "../../classes/Command";
import { getRole, notFoundEmbed } from "../../util/adminUtil";
import chalk from "chalk";
import { RichEmbed } from "discord.js";
import { embedColor } from "../../util/style";

export const command: ICommand = {
    name: "InLeft",
    description: "Give a user the ability to view left-channels",
    usage: "[@user | id]",
    aliases: ["il"],
    args: true,
    perms: ["admin", "mod"],

    async execute(message, args) {
        const query = args.shift();
        if (!query) return;

        let user = message.mentions.users.first();
        let member = (await message.guild.fetchMember(user.id)) || (await message.guild.fetchMember(query));

        if (member) {
            const role = getRole(message, '649719140323688508');
            if (!role) return console.log(chalk.bgRed.bold(`Couldnt find role left-only`));

            member.addRole(role);

            const embed = new RichEmbed()
                .setColor(embedColor)
                .addField('Lefty Alert!', '```yaml\n' + member.displayName + ' is now a beta!\n```');

            message.channel.send(embed);
        } else {
            notFoundEmbed(message, query);
        }
    }
}