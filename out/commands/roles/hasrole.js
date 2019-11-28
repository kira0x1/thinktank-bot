"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var style_1 = require("../../util/style");
exports.command = {
    name: "HasRole",
    description: "Lists user with a specific role",
    args: true,
    usage: "[RoleID]",
    perms: ["admin", "mod", "demi-mod"],
    aliases: ["inrole"],
    execute: function (message, args) {
        return __awaiter(this, void 0, void 0, function () {
            var query, roleID, role, members, perPage, pages, count, pageAt, firstPage, description, embed, msg, filter, collector, currentPage;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = args.join(" ");
                        roleID = args.shift();
                        if (!roleID)
                            return [2 /*return*/, style_1.QuickEmbed(message, "No roleID given")];
                        role = message.guild.roles.get(roleID);
                        if (!role) {
                            role = message.guild.roles.find(function (r) { return r.name.toLowerCase() === query.toLowerCase(); });
                        }
                        if (!role)
                            return [2 /*return*/, message.channel.send(">>> **Role not found**\n" + "```yaml\n" + query + "\n```")];
                        members = role.members;
                        perPage = 5;
                        pages = new discord_js_1.Collection();
                        pages.set(1, []);
                        count = 0;
                        pageAt = 1;
                        members.map(function (member) {
                            if (count >= perPage) {
                                count = 0;
                                pageAt++;
                                pages.set(pageAt, []);
                            }
                            var curPage = pages.get(pageAt);
                            if (curPage) {
                                curPage.push(member);
                            }
                            count++;
                        });
                        firstPage = pages.get(1);
                        if (!firstPage)
                            return [2 /*return*/];
                        description = "\n";
                        embed = new discord_js_1.RichEmbed()
                            .setTitle("Members in " + role.name + " (" + role.id + ")")
                            .setFooter("Page 1/" + pageAt + "\nMembers: " + members.size);
                        firstPage.map(function (member) {
                            description += "**" + member.user.tag + "** (" + member.id + ")\n\n";
                        });
                        // embed.setDescription(description)
                        embed.addField("\u200B", description);
                        return [4 /*yield*/, message.channel.send(embed)];
                    case 1:
                        msg = _a.sent();
                        if (!(msg instanceof discord_js_1.Message))
                            return [2 /*return*/];
                        if (pages.size <= 1)
                            return [2 /*return*/];
                        return [4 /*yield*/, msg.react("⬅")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, msg.react("➡")];
                    case 3:
                        _a.sent();
                        filter = function (reaction, user) {
                            return (reaction.emoji.name === "➡" || reaction.emoji.name === "⬅") && !user.bot;
                        };
                        collector = msg.createReactionCollector(filter);
                        currentPage = 1;
                        collector.on("collect", function (r) { return __awaiter(_this, void 0, void 0, function () {
                            var description, embed, page;
                            return __generator(this, function (_a) {
                                if (r.emoji.name === "➡") {
                                    currentPage++;
                                    if (currentPage > pages.size)
                                        currentPage = 1;
                                }
                                else if (r.emoji.name === "⬅") {
                                    currentPage--;
                                    if (currentPage < 1)
                                        currentPage = pages.size;
                                }
                                r.remove(r.users.last());
                                description = "\n";
                                if (!role)
                                    return [2 /*return*/];
                                embed = new discord_js_1.RichEmbed()
                                    .setTitle("Members in " + role.name + " (" + role.id + ")")
                                    .setFooter("Page " + currentPage + "/" + pageAt + "\nMembers: " + members.size);
                                page = pages.get(currentPage);
                                if (!page)
                                    return [2 /*return*/];
                                page.map(function (member) {
                                    description += "**" + member.user.tag + "** (" + member.id + ")\n\n";
                                });
                                embed.addField("\u200B", description);
                                msg.edit(embed);
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    }
};
