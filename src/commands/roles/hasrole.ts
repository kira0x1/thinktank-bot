import { Collection, GuildMember, Message, MessageReaction, RichEmbed, User } from 'discord.js';
import { ICommand } from '../../classes/Command';
import { QuickEmbed } from '../../util/style';

export const command: ICommand = {
	name: 'HasRole',
	description: 'Lists user with a specific role',
	args: true,
	usage: '[RoleID]',
	perms: ['admin', 'mod', 'demi-mod'],
	aliases: ['inrole'],

	async execute(message, args) {
		const query = args.join(' ');
		const roleID = args.shift();

		if (!roleID) return QuickEmbed(message, `No roleID given`);

		let role = message.guild.roles.get(roleID);

		if (!role) {
			role = message.guild.roles.find(r => r.name.toLowerCase() === query.toLowerCase());
		}

		if (!role)
			return message.channel.send('>>> **Role not found**\n' + '```yaml\n' + query + '\n```');

		const members = role.members;
		const perPage = 5;
		const pages: Collection<number, GuildMember[]> = new Collection();
		pages.set(1, []);

		let count = 0;
		let pageAt = 1;

		members.map(member => {
			if (count >= perPage) {
				count = 0;
				pageAt++;
				pages.set(pageAt, []);
			}

			const curPage = pages.get(pageAt);
			if (curPage) {
				curPage.push(member);
			}
			count++;
		});

		const firstPage = pages.get(1);
		if (!firstPage) return;

		let description = '\n';

		const embed = new RichEmbed()
			.setTitle(`Members in ${role.name} (${role.id})`)
			.setFooter(`Page 1/${pageAt}\nMembers: ${members.size}`);

		firstPage.map(member => {
			description += `**${member.user.tag}** (${member.id})\n\n`;
		});

		// embed.setDescription(description)
		embed.addField(`\u200b`, description);

		const msg = await message.channel.send(embed);

		if (!(msg instanceof Message)) return;
		if (pages.size <= 1) return;

		await msg.react('⬅');
		await msg.react('➡');

		const filter = (reaction: MessageReaction, user: User) => {
			return (reaction.emoji.name === '➡' || reaction.emoji.name === '⬅') && !user.bot;
		};

		const collector = msg.createReactionCollector(filter);

		let currentPage = 1;

		collector.on('collect', async r => {
			if (r.emoji.name === '➡') {
				currentPage++;
				if (currentPage > pages.size) currentPage = 1;
			} else if (r.emoji.name === '⬅') {
				currentPage--;
				if (currentPage < 1) currentPage = pages.size;
			}

			r.remove(r.users.last());
			let description = '\n';

			if (!role) return;

			const embed = new RichEmbed()
				.setTitle(`Members in ${role.name} (${role.id})`)
				.setFooter(`Page ${currentPage}/${pageAt}\nMembers: ${members.size}`);

			const page = pages.get(currentPage);
			if (!page) return;

			page.map(member => {
				description += `**${member.user.tag}** (${member.id})\n\n`;
			});

			embed.addField(`\u200b`, description);

			msg.edit(embed);
		});
	}
};
