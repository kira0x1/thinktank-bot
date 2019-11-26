import { Message, RichEmbed, MessageOptions } from 'discord.js';
import { ICommand } from '../../classes/Command';
import { commandGroups, commandInfos, commands, FindCommand, HasPerms, FindCommandInfo } from '../../util/commandUtil';
import { embedColor, QuickEmbed, wrap } from '../../util/style';
import { prefix } from '../../config';

export const command: ICommand = {
    name: "Help",
    description: "Lists all commands",
    aliases: ["h"],

    execute(message, args) {
        const query = args.join(" ")
        if (!query) {
            displayAll(message)
        } else {
            displayOne(message, query)
        }
    }
}

function displayAll(message: Message) {
    const grouped: ICommand[] = []

    //Add all grouped commands to the grouped array so we can cross
    //reference this later to check for ungrouped commands
    commandGroups.map(grp => {
        grp.map(cmd => {
            if (HasPerms(message.member, cmd.name))
                grouped.push(cmd)
        })
    })

    //Create embed
    const embed = new RichEmbed()
    embed.setTitle("Commands")
    embed.setColor(embedColor)

    //Add all ungrouped commands to the embed
    const ungrouped = commandGroups.get("ungrouped")
    if (ungrouped) {
        ungrouped.map(cmd => {
            if (HasPerms(message.member, cmd.name))
                embed.addField(cmd.name, cmd.description)
        })
    }

    //Add all group commands info to the embed
    commandInfos.map(info => {
        if (HasPerms(message.member, info.name))
            embed.addField(info.name, info.description)
    })

    message.channel.send(embed)
}

function displayOne(message: Message, query: string) {
    const command = FindCommand(query)
    let info = FindCommandInfo(query)

    if ((!command && !info) || !HasPerms(message.member, query)) {
        QuickEmbed(message, "Command not found")
    } else {

        //Create embed
        const embed = new RichEmbed()
        embed.setColor(embedColor)

        if (command) {
            InsertCommandEmbed(embed, command)
        } else if (info) {

            if (info.commands) {

                //Loop through all the commands in the CommandInfo class
                info.commands.map(cmd => {
                    let desc = cmd.description

                    //Add aliases to the description
                    if (cmd.aliases) {
                        desc += `\naliases: ${wrap(cmd.aliases, "`")}`
                    }

                    if (cmd.usage) {
                        let usage = ``
                        if (cmd.isSubCommand) {
                            let cmdGroup = ""
                            commandGroups.map((commands, group) => {
                                if (commands.includes(cmd)) cmdGroup = group
                            })

                            usage = wrap(`${prefix}${cmdGroup} ${cmd.name} ${cmd.usage}`, "`")
                        } else {
                            usage = wrap(`${prefix}${cmd.name} ${cmd.usage}`, "`")
                        }
                        desc += `\n${usage}`
                    }

                    //Add command to the embed
                    embed.addField(cmd.name.toLowerCase(), desc)
                })
            }
        }

        //Send embed
        message.channel.send(embed)
    }
}

function InsertCommandEmbed(embed: RichEmbed, command: ICommand) {
    embed.setTitle(command.name)
    embed.setDescription(command.description)

    if (command.usage) {
        embed.addField("Usage", wrap(command.usage, "`"))
    }

    if (command.aliases) {
        const aliasesString = wrap(command.aliases, "`")
        embed.addField("aliases: ", aliasesString)
    }
    return embed
}