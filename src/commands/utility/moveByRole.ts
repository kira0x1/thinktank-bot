import { ICommand } from '../../classes/Command';
import { QuickEmbed, embedColor } from '../../util/style';
import { channelAliases } from './moveVC';
import { VoiceChannel, RichEmbed } from 'discord.js';

export const command: ICommand = {
    name: "MoveByRole",
    description: "Move users from&to a voice-channel by the roles they have",
    usage: `[role] [voice-channel] [voice-channel]`,
    aliases: ["mr", "moverole"],
    args: true,
    perms: ["admin", "mod"],

    async execute(message, args) {

        //GET ROLE
        const roleQuery = args.shift()
        if (!roleQuery) return
        let role = message.guild.roles.get(roleQuery)

        //If input wasnt an id then search for the name
        if (!role) {
            role = message.guild.roles.find(r => r.name.toLowerCase() === roleQuery.toLowerCase())
        }

        //Tell user the role they gave wasnt found
        if (!role) return message.channel.send(">>> **Role not found**\n" + "```yaml\n" + roleQuery + "\n```")


        //GET VC
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
        members.filter(member => member.roles.has(role.id))
            .map(async member => {
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