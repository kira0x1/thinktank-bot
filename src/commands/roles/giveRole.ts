import { ICommand } from '../../classes/Command';
import { QuickEmbed } from '../../util/style';
import chalk from 'chalk';
import { RichEmbed, Message } from 'discord.js';
import { loadingImage } from '../../util/assetUtil';

export const command: ICommand = {
	name: 'GiveRole',
	description: 'Give a role to users with a specific role',
	perms: ['admin'],
	aliases: ['give'],
	usage: 'give <roleid> <roleid>',
	args: true,

	async execute(message, args) {
		const selectedID = args.shift();
		const giveID = args.shift();

		//If user didnt give correct amount of inputs return
		if (!selectedID || !giveID) {
			return QuickEmbed(message, 'invalid arguments');
		}

		//Get Roles by ID
		const selectedRole = message.guild.roles.get(selectedID);
		const giveRole = message.guild.roles.get(giveID);

		//If the selected role wasnt found, tell the user and exit out
		if (!selectedRole) {
			return QuickEmbed(message, `Selected Role [${selectedID}] not found`);
		}

		//If the role wasnt found, tell the user and exit out
		if (!giveRole) {
			return QuickEmbed(message, `Give Role [${giveID}] not found`);
		}

		//Add role to members with the selected role
		const promises = []
		selectedRole.members.map(member => {
			promises.push(member.addRole(giveRole))
		});

		const embed = new RichEmbed()
			.setTitle(`Adding Roles Please Wait`)
			.setAuthor(`Loading...`, `https://cdn.discordapp.com/emojis/652448408652611654.gif?v=1`)

		const msg = await message.channel.send(embed)


		Promise.all(promises)
			.then(response => {
				const embed = new RichEmbed()
				embed.setTitle(`Added Role "${giveRole.name}" to Members with role "${selectedRole.name}"`)
				embed.setDescription(`Added role to ${selectedRole.members.size} members`)
				if (msg instanceof Message) {
					msg.edit(embed)
				}
			})
			.catch(err => {
				console.error(chalk.bgRed(err))
			})
	}
};
