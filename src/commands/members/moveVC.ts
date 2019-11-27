import { ICommand } from '../../classes/Command';
import { QuickEmbed } from '../../util/style';
import { VoiceChannel, Collection } from 'discord.js';

const channelAliases = [
    { name: "Chill Voice", id: "645012348050079755", aliases: ["cv", "chill"] },
    { name: "Gaming Voice", id: "628111268170956800", aliases: ["gv", "gaming", "game", "gvoice"] },
    { name: "Serious Voice", id: "628018725450416135", aliases: ["sr", "serious", "sv", "svoice"] },
    { name: "Watch2Gether", id: "636780340664336388", aliases: ["w", "w2g", "watch"] }
]

export const command: ICommand = {
    name: "Move-Voice",
    description: "Move users from once voice-channel to another",
    aliases: ["mv", "movevoice", "voicemove", "vmove"],
    args: true,
    usage: "[ChannelID | Alias] [ChannelID | Alias]`\n\n" + channelAliases.map(ch => `**${ch.name}` + ":** [`" + ch.aliases.join("`, `") + "`]\n"),
    perms: ["admin"],

    async execute(message, args) {
        const fromQuery = args.shift()
        const toQuery = args.shift()

        if (!fromQuery || !toQuery) return QuickEmbed(message, `Invalid arguments`)

        let fromChannel = message.guild.channels.get(fromQuery)
        let toChannel = message.guild.channels.get(toQuery)

        if (!fromChannel) {
            const channelFound = channelAliases.find(ch => ch.aliases.includes(fromQuery.toLowerCase()))
            if (channelFound) {
                fromChannel = message.guild.channels.get(channelFound.id)
            }
        }

        if (!toChannel) {
            const channelFound = channelAliases.find(ch => ch.aliases.includes(toQuery.toLowerCase()))
            if (channelFound) {
                toChannel = message.guild.channels.get(channelFound.id)
            }
        }

        if (!fromChannel) return QuickEmbed(message, `From-Channel [${fromQuery}] not found`)
        if (!toChannel) return QuickEmbed(message, `To-Channel [${toQuery}] not found`)

        if (!(fromChannel instanceof VoiceChannel)) return QuickEmbed(message, `${fromChannel.name} is not a voice-channel`)
        if (!(toChannel instanceof VoiceChannel)) return QuickEmbed(message, `${toChannel.name} is not a voice-channel`)

        fromChannel.members.map(async member => {
            if (toChannel) {
                member.setVoiceChannel(toChannel)
            }
        })
    }
}