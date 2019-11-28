import { ICommand } from '../../classes/Command';
import { QuickEmbed } from '../../util/style';

export const command: ICommand = {
	name: 'GiveRole',
	description: 'Give a role to users with a specific role',
	perms: ['admin'],
	aliases: ['give'],
	usage: 'give <roleid> <roleid>',
	args: true,

	execute(message, args) {
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
		selectedRole.members.map(member => {
			member.addRole(giveRole);
		});
	}
};
