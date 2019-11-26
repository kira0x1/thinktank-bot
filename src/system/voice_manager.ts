import { Client, VoiceChannel } from 'discord.js';
import { guild_id } from '../config';

export async function initVoiceManager(client: Client) {

    const guild = client.guilds.get(guild_id)
    if (!guild) return


    const voice_role = guild.roles.get("644177706367451163")
    if (!voice_role) return

    guild.members.map(m => {
        if (m.roles.has(voice_role.id)) {
            m.removeRole(voice_role)
        }
    })

    guild.channels.map(channel => {
        if (((channel): channel is VoiceChannel => channel.type === "voice")(channel)) {
            channel.members.map(member => {
                member.addRole(voice_role)
            })
        }
    })


    client.on("voiceStateUpdate", (oldMember, newMember) => {
        const member = oldMember || newMember

        if (member.guild.id !== guild_id) {
            return;
        }

        const oldChannel = oldMember.voiceChannel
        const newChannel = newMember.voiceChannel


        if (!oldChannel && newChannel) {
            //User joined a vc
            newMember.addRole(voice_role)
        } else if (!newChannel) {
            //User left vc
            newMember.removeRole(voice_role)
        }
    })
}