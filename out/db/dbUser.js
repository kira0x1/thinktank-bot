"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var discord_js_1 = require("discord.js");
var mongoose_1 = require("mongoose");
var database_1 = require("./database");
exports.users = new discord_js_1.Collection();
exports.UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    userId: { type: String, required: true },
    tag: { type: String, required: true },
    roles: { type: [{ name: String, id: String }], required: true },
    rapsheet: { type: Array(), required: true },
    createdAt: Date
});
exports.userModel = mongoose_1.model("users", exports.UserSchema);
//Create a UserModel and insert it into the database, returns an error if the user already exists
function CreateUser(user) {
    var usersModel = database_1.conn.model("users", exports.UserSchema);
    if (user instanceof discord_js_1.GuildMember) {
        var memberUser_1 = {
            username: user.user.username,
            tag: user.user.tag,
            userId: user.id,
            rapsheet: [],
            roles: []
        };
        exports.userModel.create(memberUser_1).then(function () { return console.log("Created user " + memberUser_1.username); }).catch(function (err) {
            console.log(chalk_1.default.bgRed.bold("Error while trying to create user"));
        });
        return;
    }
    usersModel.create(user).then(function () { return console.log("created user " + user.username); })
        .catch(function (err) { return console.log(chalk_1.default.bgRed.bold("Error while trying to create user")); });
}
exports.CreateUser = CreateUser;
