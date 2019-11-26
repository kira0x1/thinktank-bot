import chalk from 'chalk';
import { Collection, GuildMember } from 'discord.js';
import { model, Schema } from 'mongoose';
import { conn } from "./database";
import { IRole } from './dbRole';

export var users: Collection<string, IUser> = new Collection()

export interface IUser {
    username: string,
    userId: string,
    tag: string,
    roles: IRole[],
    rapsheet: IRapsheet[]
}

export interface IRapsheet {
    author: IUser,
    user: IUser,
    punishment: string,
    reason: string
}


export const UserSchema = new Schema({
    username: { type: String, required: true },
    userId: { type: String, required: true },
    tag: { type: String, required: true },
    roles: { type: [{ name: String, id: String }], required: true },
    rapsheet: { type: Array<IRapsheet>(), required: true },
    createdAt: Date
})

export const userModel = model("users", UserSchema)


//Create a UserModel and insert it into the database, returns an error if the user already exists
export function CreateUser(user: IUser | GuildMember) {
    var usersModel = conn.model("users", UserSchema);

    if (user instanceof GuildMember) {
        const memberUser: IUser = {
            username: user.user.username,
            tag: user.user.tag,
            userId: user.id,
            rapsheet: [],
            roles: []
        }
        userModel.create(memberUser).then(() => console.log(`Created user ${memberUser.username}`)).catch(err => {
            console.log(chalk.bgRed.bold(`Error while trying to create user`))
        })
        return
    }

    usersModel.create(user).then(() => console.log(`created user ${user.username}`))
        .catch(err => console.log(chalk.bgRed.bold(`Error while trying to create user`)))
}
