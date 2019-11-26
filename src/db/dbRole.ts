import { Collection } from 'discord.js';
import { model, Schema } from 'mongoose';
import { conn } from "./database";

export var persistenRoles: Collection<string, IRole> = new Collection()


export interface IRole {
    name: string,
    roleId: string,
}

export const RoleSchema = new Schema({
    name: { type: String, required: true },
    roleId: { type: String, required: true },
    createdAt: Date
})

export const roleModel = model("roles", RoleSchema)


//Create a UserModel and insert it into the database, returns an error if the user already exists
export function CreateRole(role: IRole) {
    var roleModel = conn.model("roles", RoleSchema);
    roleModel.create({ name: role.name, roleId: role.roleId })
        .then(() => console.log("Created role " + role.name))
        .catch(err => console.log("Error while trying to create role\n\n" + err))
}

export async function initRoles() {
    conn.db.collections().then(async collections => {
        const roles = collections.find(col => col.collectionName === "roles")
        if (!roles) return console.log("couldnt find roles")
        roles.find().toArray().then(roleArray => {
            roleArray.map(role => {
                persistenRoles.set(role.roleId, { name: role.name, roleId: role.roleId })
            })
        })
    })
}
