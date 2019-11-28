import { ICommand } from '../../classes/Command';
import { QuickEmbed } from '../../util/style';

export const command: ICommand = {
	name: 'RemoveRole',
	description: 'Remove a role from users with a specific role',
	perms: ['admin'],
	aliases: ['roleremove'],
	usage: 'removerole <roleid> <roleid>',
	args: true,

	execute(message, args) {
		const selectedID = args.shift();
		const removeID = args.shift();

		//If user didnt give correct amount of inputs return
		if (!selectedID || !removeID) {
			return QuickEmbed(message, 'invalid arguments');
		}

		//Get Roles by ID
		const selectedRole = message.guild.roles.get(selectedID);
		const removeRole = message.guild.roles.get(removeID);

		//If the selected role wasnt found, tell the user and exit out
		if (!selectedRole) {
			return QuickEmbed(message, `Selected Role [${selectedID}] not found`);
		}

		//If the role wasnt found, tell the user and exit out
		if (!removeRole) {
			return QuickEmbed(message, `Remove Role [${removeID}] not found`);
		}

		//Remove the role from users with a specific role
		selectedRole.members.map(member => {
			member.removeRole(removeRole);
		});
	}
};
