import { ICommand } from "../../classes/Command";
import { deleteBan } from "../../db/bannedController";
import { bannedUsers } from "../../db/dbBanned";
import { QuickEmbed } from "../../util/style";

export const command: ICommand = {
    name: "Un-Ban",
    description: "Un-ban a user",
    aliases: ["unban", "uban"],
    args: true,
    usage: "[@user | userid]",
    perms: ["admin"],

    async execute(message, args) {
        let users = args.join(" ").split(",")
        if (!users) return

        users.map(id => {
            if (bannedUsers.find(b => b.userId === id)) {
                deleteBan(id)
                QuickEmbed(message, `Unbanned id: **${id}**`)
                const index = bannedUsers.indexOf({ userId: id })
                bannedUsers.splice(index, 1)
            } else {
                QuickEmbed(message, `This id is not banned`)
            }
        })
    }
}