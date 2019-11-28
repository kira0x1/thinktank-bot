import { GuildMember, Message, RichEmbed } from 'discord.js';
import { guild_id } from '../config';
import { embedColor } from './style';

export function getTarget(message: Message, query: string) {
    const member = message.mentions ? message.mentions.members.first() : message.guild.members.get(query)
    return member
}

export function getRole(message: Message, roleName: string) {
    const guild = message.client.guilds.get(guild_id)
    if (!guild) return

    return guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase() || role.id === roleName)
}

export async function adminEmbed(message: Message, member: GuildMember, title: string, reason?: string) {
    const author = message.author

    const embed = new RichEmbed()
        .setColor(embedColor)
        .setTitle(title)
        .setAuthor(author.username, author.avatarURL)
        .addField(`User`, member.user.tag + "\n" + "`" + member.id + "`")
        .addField(`Reason`, reason || 'none')
        .setThumbnail(member.user.avatarURL);

    message.channel.send(embed);
}

export async function notFoundEmbed(message: Message, query: string) {
    const embed = new RichEmbed()
        .setColor(embedColor)
        .setTitle(`"${query}" not found`)

    message.channel.send(embed)
}