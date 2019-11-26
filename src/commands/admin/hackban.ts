import { ICommand } from "../../classes/Command";
import { addBan } from "../../db/bannedController";
import { bannedUsers } from '../../db/dbBanned';
import { QuickEmbed } from "../../util/style";

export const command: ICommand = {
    name: "HackBan",
    description: "Premtively Ban multiple people",
    aliases: ["hb", "ban"],
    perms: ["admin"],
    usage: "[user1, user2, user3..]",
    args: true,

    async execute(message, args) {
        let users = args.join(" ").split(",")
        if (!users) return

        users.map(id => {
            if (bannedUsers.find(b => b.userId === id)) {
                QuickEmbed(message, `This id is already banned`)
            } else {
                addBan(id);
                bannedUsers.push({ userId: id })
                QuickEmbed(message, `Banned id: **${id}**`)
            }
        })
    }
}