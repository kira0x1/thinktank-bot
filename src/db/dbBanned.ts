import { model, Schema } from 'mongoose';
import { conn } from "./database";

export var bannedUsers: IBanned[] = []

export interface IBanned {
    userId: string
}

export const BannedSchema = new Schema({
    userId: { type: String, required: true },
    createdAt: Date
})

export const bannedModel = model("banned", BannedSchema)

//Create a UserModel and insert it into the database, returns an error if the user already exists
export function CreateBan(userId: string) {
    var bannedModel = conn.model("banned", BannedSchema);
    bannedModel.create({ userId: userId })
        .then(() => console.log("Banned user" + userId))
        .catch(err => console.log("Error while trying to ban user\n\n" + err))
}

export async function initBanned() {
    conn.db.collections().then(async collections => {
        const banned = collections.find(col => col.collectionName === "banneds")
        if (!banned) return console.log("couldnt find banned db")
        const bannedFound = await banned.find().toArray()
        bannedFound.map(id => {
            bannedUsers.push(id)
        })
    })
}
