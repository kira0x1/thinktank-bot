import chalk from 'chalk';
import { Client, RichEmbed, Role, TextChannel, Message } from 'discord.js';
import { guild_id, prefix, token, perms } from './config';
import { dbInit } from './db/database';
import { persistenRoles, initRoles, IRole } from './db/dbRole';
import { CreateUser, IUser } from './db/dbUser';
import { getUser, updateUser } from './db/userController';
import { syncRoles, OnReactionRemove } from './system/sync_roles';
import { initVoiceManager } from './system/voice_manager';
import { FindCommand, FindCommandGroup, InitCommands, HasPerms } from './util/commandUtil';
import { embedColor, QuickEmbed, wrap } from './util/style';
import { initBanned } from './db/dbBanned';
import { OnMessageBot } from './system/bump_reminder';

const client = new Client({
    disabledEvents: ["TYPING_START"]
})

async function init() {
    await dbInit()
    client.login(token);
}

client.on("ready", () => {

    //Get persistant roles
    initRoles()

    //Sets up voice role when users are in voice
    initVoiceManager(client)

    initBanned()

    //Sync roles
    syncRoles(client)

    //Setup command files
    InitCommands();

    console.log(chalk.bgCyan.bold(`${client.user.username} online!`))
})


client.on('raw', packet => {
    if (![`MESSAGE_REACTION_REMOVE`].includes(packet.t)) return

    const channel = client.channels.get(packet.d.channel_id)
    if (!channel) return console.log(`channel not found in raw event`)
    if (!((channel): channel is TextChannel => channel.type === "text")(channel)) return

    //If the message is cached then dont emit since the event will fire anyway
    const message = channel.messages.get(packet.d.message_id)

    if (message) {
        HandleRawEvent(message, packet)
    } else {
        channel.fetchMessage(packet.d.message_id).then(message => {
            HandleRawEvent(message, packet)
        })
    }
})

function HandleRawEvent(message: Message, packet: any) {
    // Emojis can have identifiers of name:id format, so we have to account for that case as well
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;

    // This gives us the reaction we need to emit the event properly, in top of the message object
    const reaction = message.reactions.get(emoji);

    const user = client.users.get(packet.d.user_id)
    if (!user) return console.log(`user not found in raw event`)

    // Adds the currently reacting user to the reaction's users collection.
    if (reaction) reaction.users.set(packet.d.user_id, user);
    if (!reaction) return

    if (packet.t === 'MESSAGE_REACTION_REMOVE') {
        OnReactionRemove(reaction, user)
    }
}


client.on("guildMemberAdd", member => {
    if (member.guild.id !== guild_id) return
    console.log(chalk.bgBlue.bold(`User joined ${member.user.tag}`))

    getUser(member.user.id).then(user => {
        const guild = client.guilds.get(guild_id)
        if (!guild) return

        const userRoles = user.roles
        const rolesToAdd: Role[] = []

        for (let i = 0; i < userRoles.length; i++) {
            console.log(userRoles[i].roleId)

            const guildRole = member.guild.roles.find(r => r.name === userRoles[i].name)

            if (guildRole && rolesToAdd.includes(guildRole) === false) {
                rolesToAdd.push(guildRole)
                console.log(`added ${guildRole.name} to user`)
            }
        }

        member.addRoles(rolesToAdd)

        console.log(`added roles to user ${member.displayName}`)

    }).catch(() => {
        const iuser: IUser = {
            username: member.user.username,
            tag: member.user.tag,
            userId: member.id,
            rapsheet: [],
            roles: []
        }

        member.roles.map(role => {
            if (persistenRoles.has(role.id)) {
                iuser.roles.push({ name: role.name, roleId: role.id })
            }
        })

        CreateUser(iuser)
    })
})

client.on("guildMemberRemove", member => {
    if (!member) return
    if (member.guild.id !== guild_id) return

    console.log(chalk.bgMagenta.bold(`User left ${member.user.username}`))

    getUser(member.user.id).then(user => {
        const guild = client.guilds.get(guild_id)
        if (!guild) return

        user.roles = []

        member.roles.map(role => {
            if (persistenRoles.find(r => r.roleId === role.id)) {
                user.roles.push({ name: role.name, roleId: role.id })
                console.log(role.name)
            }
        })

        updateUser(member.user.id, user).then(() => console.log(`updated user ${user.tag}`))
            .catch(err => console.log("error while trying to update user"))

    }).catch(err => {
        console.log(err)
        const iuser: IUser = {
            username: member.user.username,
            tag: member.user.tag,
            userId: member.id,
            rapsheet: [],
            roles: []
        }

        member.roles.map(role => {
            if (persistenRoles.find(pr => pr.roleId === role.id)) {
                iuser.roles.push({ name: role.name, roleId: role.id })
            }
        })

        CreateUser(iuser)
    })
})

client.on("message", message => {
    if (message.author.bot || !message.content.startsWith(prefix)) {
        OnMessageBot(message)
        return;
    }

    if (perms.find(p => message.member.roles.has(p.roleId)) === undefined) {
        return
    }

    let args = message.content.slice(prefix.length).split(/ +/)
    let commandName = args.shift()
    if (!commandName) return;
    if (commandName.startsWith(prefix)) return

    commandName = commandName.toLowerCase()

    let command = FindCommand(commandName)

    if (!command) {
        const grp = FindCommandGroup(commandName)
        if (grp) {
            commandName = args.shift()
            if (!commandName) return
            command = grp.find(cmd => cmd.name.toLowerCase() === commandName || cmd.aliases && cmd.aliases.find(al => al === commandName))
        }
    }

    if (!command) return message.author.send(`command ${wrap(commandName || "")} not found`)

    //Exit out if command is disabled
    if (command.disabled) return

    if (!HasPerms(message.member, command.name)) return

    if (command.args && args.length === 0) {
        let usageString = "Arguments required"

        const embed = new RichEmbed()
        embed.setColor(embedColor)

        if (command.usage) {
            usageString = command.name + " "
            usageString += wrap(command.usage, "`")
        }

        embed.addField("Arguments Required", usageString)
        return message.channel.send(embed)
    }

    try {
        command.execute(message, args)
    }
    catch (err) {
        console.error(err)
    }
})

init()