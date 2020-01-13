import { VoiceChannel, RichEmbed } from 'discord.js';
import { ICommand } from '../../classes/Command';
import { QuickEmbed, embedColor } from '../../util/style';

export const channelAliases = [
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

        //If not enough inputs return
        if (!fromQuery || !toQuery) return QuickEmbed(message, `Invalid arguments`)

        //Get channels by id
        let fromChannel = message.guild.channels.get(fromQuery)
        let toChannel = message.guild.channels.get(toQuery)

        //If an id was not given then search
        if (!fromChannel) {
            const channelFound = channelAliases.find(ch => ch.aliases.includes(fromQuery.toLowerCase()))
            if (channelFound) {
                fromChannel = message.guild.channels.get(channelFound.id)
            }
        }

        //If an id was not given then search
        if (!toChannel) {
            const channelFound = channelAliases.find(ch => ch.aliases.includes(toQuery.toLowerCase()))
            if (channelFound) {
                toChannel = message.guild.channels.get(channelFound.id)
            }
        }

        //Check if channels were not found
        if (!fromChannel) return QuickEmbed(message, `From-Channel [${fromQuery}] not found`)
        if (!toChannel) return QuickEmbed(message, `To-Channel [${toQuery}] not found`)

        //Make sure the channels are voicechannels
        if (!(fromChannel instanceof VoiceChannel)) return QuickEmbed(message, `${fromChannel.name} is not a voice-channel`)
        if (!(toChannel instanceof VoiceChannel)) return QuickEmbed(message, `${toChannel.name} is not a voice-channel`)


        //Set members in the selected voice channel
        const members = fromChannel.members

        //Move members in the channel
        members.map(async member => {
            if (member.voiceChannel) {
                member.setVoiceChannel(toChannel)
            }
        })

        //Check if any members have not been moved, and then move them
        members.filter(member => member.voiceChannel === fromChannel)
            .map(member => member.setVoiceChannel(toChannel))


        //Send confirmation embed
        const embed = new RichEmbed()
        embed.setColor(embedColor)
        embed.setTitle(`Moving ${members.size} from ${fromChannel.name} to ${toChannel.name}`)
        embed.setAuthor(message.author.username, message.author.avatarURL)

        message.channel.send(embed)
    }
}