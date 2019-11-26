import { ICommand } from '../../classes/Command';
import { adminEmbed, getRole, notFoundEmbed } from '../../util/adminUtil';

export const command: ICommand = {
    name: "VoiceMute",
    description: "voice mute a user",
    usage: "[@user | id]",
    aliases: ["vmute", "vcmute", "mutevc", "mutev", "mute"],
    perms: ["admin", "mod"],
    args: true,

    async execute(message, args) {
        const query = args.shift()
        if (!query) return

        let member = message.mentions.members.first()

        if (!member) {
            member = await message.guild.fetchMember(query)
        }

        if (member) {
            const role = getRole(message, "629770803285721089")
            if (!role) return console.log(`could not find role voicemute`)

            //NOTE Add voicemute role
            member.addRole(role)

            //NOTE Send embed
            adminEmbed(message, member, "Voice Mute", args.join(" "))
        } else {
            notFoundEmbed(message, query)
        }
    }
}