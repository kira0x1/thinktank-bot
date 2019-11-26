import { Message, DiscordAPIError, TextChannel } from 'discord.js';
import ms from 'ms';
import { guild_id } from '../config';
import chalk from 'chalk';

const disboardId = "302050872383242240"
let timer
const bumpChannelId = "635469422869348392"

export function OnMessageBot(message: Message) {
    if (message.author.id !== disboardId || message.guild.id !== guild_id) return

    let description = message.embeds[0].description
    let args = description.split(" ")
    args.shift()

    let firstWord = args.shift()

    //Failed
    if (firstWord === "Please") {
        let time = args[2];
        SetReminder(message, time + "m")
    } else { //Success
        SetReminder(message, "2h")
    }
}

function SetReminder(message: Message, time: string) {
    if (timer) {
        clearTimeout(timer)
    }

    console.log(chalk.bgBlue.bold(`Set bump reminder for ${time}`))

    timer = setTimeout(() => {
        const guild = message.client.guilds.get(guild_id)
        if (guild) {
            const channel = guild.channels.get(bumpChannelId)
            if (!channel) return
            if (channel instanceof TextChannel) {
                channel.send(`@here Reminder to bump 💖`)
            }
        }
    }, ms(time))
}