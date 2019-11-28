import chalk from 'chalk';
import { Client, Emoji, Guild, Message, MessageReaction, ReactionEmoji, Role, TextChannel, User, RichEmbed } from 'discord.js';
import { guild_id } from '../config';

const customRoles = require('../../customRoles.json')

export async function syncRoles(client: Client) {
    const guild = client.guilds.get(guild_id)
    if (!guild) return

    const channel = guild.channels.get("628565019508080660")
    if (!channel) return
    if (!((channel): channel is TextChannel => channel.type === "text")(channel)) return console.log("Couldnt find channel")

    channel.fetchMessages({ limit: 100 }).then(messages => {
        messages.map(msg => {
            if (msg.reactions.size > 0) {
                msg.reactions.map(rc => {
                    syncEmoji(msg, rc.emoji)
                })
            }
        })
    }).catch(err => {
        console.log(err)
    })
}

export function OnReactionRemove(reaction: MessageReaction, user: User) {
    if (reaction.message.channel.id !== "628565019508080660") return

    const guild = reaction.message.guild
    const channel = guild.channels.get("628565019508080660")

    if (!channel) return
    if (!((channel): channel is TextChannel => channel.type === "text")(channel)) return console.log("Couldnt find channel")


    if (customRoles.sections.map(section => section.roles.find(role => role.emoji === reaction.emoji.toString())) === false) return
    if (user.bot) return

    const member = guild.members.get(user.id)
    const section = customRoles.sections.find(sec => sec.roles.find(rl => rl.emoji === reaction.emoji.toString()))

    if (!section) return
    const crole = section.roles.find(rl => rl.emoji === reaction.emoji.toString())
    const role = guild.roles.find(rl => rl.id === crole.id)

    if (!member || !section || !role) return console.log("er")

    const rolesFound: Role[] = []

    member.roles.map(role => {
        if (section.roles.find(r => r.id === role.id)) {
            rolesFound.push(role)
        }
    })

    if (member.roles.has(role.id)) {
        const roles: Role[] = [role]


        if (rolesFound.length === 1) {
            const otherSections = customRoles.sections.filter(sec => sec.sectionId === section.sectionId).find(sec => sec.roles.find(r => member.roles.has(r.roleId)))

            if (!otherSections) {
                const sectionRole = member.guild.roles.get(section.sectionId)
                if (sectionRole) {
                    roles.push(sectionRole)
                }
            }
        }

        member.removeRoles(roles).then(user => {
            // console.log(chalk.bgMagenta.bold(`Removed role(s) from ${user.displayName}`))
        }).catch(err => {
            console.log(chalk.bgRed.bold(err))
        })
    }
}


function syncRoleSections(guild: Guild) {
    guild.members.map(member => {
        const sections: string[] = []
        member.roles.map(role => {
            customRoles.sections.map(sec => {
                if (sec.roles.find(rl => rl.id === role.id)) {
                    if (!sections.includes(sec.sectionId)) {
                        sections.push(sec.sectionId)
                    }
                }
            })
        })

        const roles = guild.roles.filter(rl => sections.some(sec => sec === rl.id) && member.roles.has(rl.id) === false)
        member.addRoles(roles).then(member => {
            console.log(chalk.bgMagenta.bold(`Added roles to ${member.displayName}`))
        }).catch(err => {
            console.log(chalk.bgRed.bold(err))
        })
    })
}

async function syncEmoji(msg: Message, emoji: Emoji | ReactionEmoji) {
    const filter = (reaction: MessageReaction, user: User) => {
        return reaction.emoji.id === emoji.id && !user.bot && customRoles.sections.find(sec => sec.roles.find(rl => rl.emoji === emoji.toString()));
    };

    const collector = msg.createReactionCollector(filter)

    collector.on("collect", async r => {
        const user = r.users.last()
        const member = msg.guild.members.get(user.id)

        const section = customRoles.sections.find(sec => sec.roles.find(rl => rl.emoji === r.emoji.toString()))
        if (!section) return
        const crole = section.roles.find(rl => rl.emoji === r.emoji.toString())

        if (!section) return console.log("couldnt find section")
        if (!crole) return console.log("couldnt find crole")

        const role = msg.guild.roles.find(rl => rl.id === crole.id)

        if (!role) {
            return console.log(`couldnt find role`)
        }


        if (member) {
            if (member.roles.has(role.id) === false) {
                const roles: Role[] = [role]

                if (member.roles.has(section.sectionId) === false) {
                    const sectionRole = member.guild.roles.get(section.sectionId)
                    if (sectionRole) {
                        roles.push(sectionRole)
                    }
                }

                member.addRoles(roles).then(async member => {
                    // console.log(chalk.bgMagenta.bold(`Added role(s) to ${member.displayName} (roles: ${roles.length})`))
                }).catch(err => {
                    console.log(chalk.bgRed.bold(err))
                })
            }
        }
    })
}