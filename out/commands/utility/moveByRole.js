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
var style_1 = require("../../util/style");
var moveVC_1 = require("./moveVC");
var discord_js_1 = require("discord.js");
exports.command = {
    name: "MoveByRole",
    description: "Move users from&to a voice-channel by the roles they have",
    usage: "[role] [voice-channel] [voice-channel]",
    aliases: ["mr", "moverole"],
    args: true,
    perms: ["admin", "mod"],
    execute: function (message, args) {
        return __awaiter(this, void 0, void 0, function () {
            var roleQuery, role, fromQuery, toQuery, fromChannel, toChannel, channelFound, channelFound, members, embed;
            var _this = this;
            return __generator(this, function (_a) {
                roleQuery = args.shift();
                if (!roleQuery)
                    return [2 /*return*/];
                role = message.guild.roles.get(roleQuery);
                //If input wasnt an id then search for the name
                if (!role) {
                    role = message.guild.roles.find(function (r) { return r.name.toLowerCase() === roleQuery.toLowerCase(); });
                }
                //Tell user the role they gave wasnt found
                if (!role)
                    return [2 /*return*/, message.channel.send(">>> **Role not found**\n" + "```yaml\n" + roleQuery + "\n```")
                        //GET VC
                    ];
                fromQuery = args.shift();
                toQuery = args.shift();
                //If not enough inputs return
                if (!fromQuery || !toQuery)
                    return [2 /*return*/, style_1.QuickEmbed(message, "Invalid arguments")
                        //Get channels by id
                    ];
                fromChannel = message.guild.channels.get(fromQuery);
                toChannel = message.guild.channels.get(toQuery);
                //If an id was not given then search
                if (!fromChannel) {
                    channelFound = moveVC_1.channelAliases.find(function (ch) { return ch.aliases.includes(fromQuery.toLowerCase()); });
                    if (channelFound) {
                        fromChannel = message.guild.channels.get(channelFound.id);
                    }
                }
                //If an id was not given then search
                if (!toChannel) {
                    channelFound = moveVC_1.channelAliases.find(function (ch) { return ch.aliases.includes(toQuery.toLowerCase()); });
                    if (channelFound) {
                        toChannel = message.guild.channels.get(channelFound.id);
                    }
                }
                //Check if channels were not found
                if (!fromChannel)
                    return [2 /*return*/, style_1.QuickEmbed(message, "From-Channel [" + fromQuery + "] not found")];
                if (!toChannel)
                    return [2 /*return*/, style_1.QuickEmbed(message, "To-Channel [" + toQuery + "] not found")
                        //Make sure the channels are voicechannels
                    ];
                //Make sure the channels are voicechannels
                if (!(fromChannel instanceof discord_js_1.VoiceChannel))
                    return [2 /*return*/, style_1.QuickEmbed(message, fromChannel.name + " is not a voice-channel")];
                if (!(toChannel instanceof discord_js_1.VoiceChannel))
                    return [2 /*return*/, style_1.QuickEmbed(message, toChannel.name + " is not a voice-channel")
                        //Set members in the selected voice channel
                    ];
                members = fromChannel.members;
                //Move members in the channel
                members.filter(function (member) { return member.roles.has(role.id); })
                    .map(function (member) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (member.voiceChannel) {
                            member.setVoiceChannel(toChannel);
                        }
                        return [2 /*return*/];
                    });
                }); });
                //Check if any members have not been moved, and then move them
                members.filter(function (member) { return member.voiceChannel === fromChannel; })
                    .map(function (member) { return member.setVoiceChannel(toChannel); });
                embed = new discord_js_1.RichEmbed();
                embed.setColor(style_1.embedColor);
                embed.setTitle("Moving " + members.size + " from " + fromChannel.name + " to " + toChannel.name);
                embed.setAuthor(message.author.username, message.author.avatarURL);
                message.channel.send(embed);
                return [2 /*return*/];
            });
        });
    }
};
