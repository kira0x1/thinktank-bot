import { conn } from './database';
import { bannedModel, BannedSchema, IBanned } from './dbBanned';

export let allBanned = () => {
    return new Promise(function (resolve, reject) {
        let banned = bannedModel.find((err: any, users: any) => {
            if (err) reject(err);
            else resolve(users)
        })
    })
}

// - GET - /user/{1} # returns user with userId 1
export async function getBanned(id: string): Promise<IBanned> {
    return new Promise(async function (resolve, reject) {
        var bannedModel = conn.model("banned", BannedSchema)
        await bannedModel.findOne({ userId: id }, (err: any, user: any) => {
            if (err || user === null) reject(err)
            else resolve(user)
        })
    })
}

// - PUT - /user # inserts a new user into the table
export async function addBan(id: string) {
    return new Promise(async function (resolve, reject) {
        var bannedModel = await conn.model("banned", BannedSchema)
        await bannedModel.create({ userId: id }).then(user => {
            resolve(user)
        }).catch(err => reject(err))
    })
}

export async function deleteBan(id: string) {
    return new Promise(async function (resolve, reject) {
        var bannedModel = await conn.model("banned", BannedSchema)
        bannedModel.deleteOne({ userId: id }, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(`Successfuly Deleted User`);
            }
        })
    })
}
