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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var chalk_1 = __importDefault(require("chalk"));
var customRoles = require('../../customRoles.json');
function syncRoles(client) {
    return __awaiter(this, void 0, void 0, function () {
        var guild, channel;
        return __generator(this, function (_a) {
            guild = client.guilds.get(config_1.guild_id);
            if (!guild)
                return [2 /*return*/];
            channel = guild.channels.get("628565019508080660");
            if (!channel)
                return [2 /*return*/];
            if (!(function (channel) { return channel.type === "text"; })(channel))
                return [2 /*return*/, console.log("Couldnt find channel")];
            channel.fetchMessages({ limit: 100 }).then(function (messages) {
                messages.map(function (msg) {
                    if (msg.reactions.size > 0) {
                        msg.reactions.map(function (rc) {
                            syncEmoji(msg, rc.emoji);
                        });
                    }
                });
            }).catch(function (err) {
                console.log(err);
            });
            return [2 /*return*/];
        });
    });
}
exports.syncRoles = syncRoles;
function OnReactionRemove(reaction, user) {
    var guild = reaction.message.guild;
    var channel = guild.channels.get("628565019508080660");
    if (!channel)
        return;
    if (!(function (channel) { return channel.type === "text"; })(channel))
        return console.log("Couldnt find channel");
    if (customRoles.sections.map(function (section) { return section.roles.find(function (role) { return role.emoji === reaction.emoji.toString(); }); }) === false)
        return;
    if (user.bot)
        return;
    var member = guild.members.get(user.id);
    var section = customRoles.sections.find(function (sec) { return sec.roles.find(function (rl) { return rl.emoji === reaction.emoji.toString(); }); });
    if (!section)
        return;
    var crole = section.roles.find(function (rl) { return rl.emoji === reaction.emoji.toString(); });
    var role = guild.roles.find(function (rl) { return rl.id === crole.id; });
    if (!member || !section || !role)
        return console.log("er");
    var rolesFound = [];
    member.roles.map(function (role) {
        if (section.roles.find(function (r) { return r.id === role.id; })) {
            rolesFound.push(role);
        }
    });
    if (member.roles.has(role.id)) {
        var roles = [role];
        if (rolesFound.length === 1) {
            var otherSections = customRoles.sections.filter(function (sec) { return sec.sectionId === section.sectionId; }).find(function (sec) { return sec.roles.find(function (r) { return member.roles.has(r.roleId); }); });
            if (!otherSections) {
                var sectionRole = member.guild.roles.get(section.sectionId);
                if (sectionRole) {
                    roles.push(sectionRole);
                }
            }
        }
        member.removeRoles(roles).then(function (user) {
            // console.log(chalk.bgMagenta.bold(`Removed role(s) from ${user.displayName}`))
        }).catch(function (err) {
            console.log(chalk_1.default.bgRed.bold(err));
        });
    }
}
exports.OnReactionRemove = OnReactionRemove;
function syncRoleSections(guild) {
    guild.members.map(function (member) {
        var sections = [];
        member.roles.map(function (role) {
            customRoles.sections.map(function (sec) {
                if (sec.roles.find(function (rl) { return rl.id === role.id; })) {
                    if (!sections.includes(sec.sectionId)) {
                        sections.push(sec.sectionId);
                    }
                }
            });
        });
        var roles = guild.roles.filter(function (rl) { return sections.some(function (sec) { return sec === rl.id; }) && member.roles.has(rl.id) === false; });
        member.addRoles(roles).then(function (member) {
            console.log(chalk_1.default.bgMagenta.bold("Added roles to " + member.displayName));
        }).catch(function (err) {
            console.log(chalk_1.default.bgRed.bold(err));
        });
    });
}
function syncEmoji(msg, emoji) {
    return __awaiter(this, void 0, void 0, function () {
        var filter, collector;
        var _this = this;
        return __generator(this, function (_a) {
            filter = function (reaction, user) {
                return reaction.emoji.id === emoji.id && !user.bot && customRoles.sections.find(function (sec) { return sec.roles.find(function (rl) { return rl.emoji === emoji.toString(); }); });
            };
            collector = msg.createReactionCollector(filter);
            collector.on("collect", function (r) { return __awaiter(_this, void 0, void 0, function () {
                var user, member, section, crole, role, roles, sectionRole;
                var _this = this;
                return __generator(this, function (_a) {
                    user = r.users.last();
                    member = msg.guild.members.get(user.id);
                    section = customRoles.sections.find(function (sec) { return sec.roles.find(function (rl) { return rl.emoji === r.emoji.toString(); }); });
                    if (!section)
                        return [2 /*return*/];
                    crole = section.roles.find(function (rl) { return rl.emoji === r.emoji.toString(); });
                    if (!section)
                        return [2 /*return*/, console.log("couldnt find section")];
                    if (!crole)
                        return [2 /*return*/, console.log("couldnt find crole")];
                    role = msg.guild.roles.find(function (rl) { return rl.id === crole.id; });
                    if (!role) {
                        return [2 /*return*/, console.log("couldnt find role")];
                    }
                    if (member) {
                        if (member.roles.has(role.id) === false) {
                            roles = [role];
                            if (member.roles.has(section.sectionId) === false) {
                                sectionRole = member.guild.roles.get(section.sectionId);
                                if (sectionRole) {
                                    roles.push(sectionRole);
                                }
                            }
                            member.addRoles(roles).then(function (member) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                });
                            }); }).catch(function (err) {
                                console.log(chalk_1.default.bgRed.bold(err));
                            });
                        }
                    }
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/];
        });
    });
}
