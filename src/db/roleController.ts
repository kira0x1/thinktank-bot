import { conn } from './database';
import { roleModel, RoleSchema } from './dbRole';
import { IRole } from './dbRole';

// - GET - /roles # returns all users
export function allRoles(): Promise<any> {
    return new Promise(function (resolve, reject) {
        let roles = roleModel.find((err: any, users: any) => {
            if (err) reject(err)
            else resolve(roles)
        })
    })
}

// - GET - /role/{1} # returns role with roleId 1
export async function getRole(roleId: string): Promise<IRole> {
    return new Promise(async function (resolve, reject) {
        var roleModel = conn.model("roles", RoleSchema)
        await roleModel.findOne({ roleId: roleId }, (err: any, role: any) => {
            if (err || role === null) reject(err)
            else resolve(role)
        })
    })
}


// - PUT - /role # inserts a new role into the table
export async function addRole(role: IRole) {
    return new Promise(async function (resolve, reject) {
        var roleModel = conn.model("roles", RoleSchema)
        await roleModel.create({ name: role.name, roleId: role.roleId })
            .then(role => {
                resolve(role)
            }).catch(err => {
                reject(err)
            })
    })
}

export async function deleteRole(roleId: string) {
    return new Promise(async function (resolve, reject) {
        var roleModel = conn.model("roles", RoleSchema)
        roleModel.deleteOne({ roleId: roleId }, (err: any) => {
            if (err) {
                reject(err)
            } else {
                resolve(`Successfully deleted role`)
            }
        })
    })
}
