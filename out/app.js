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
var chalk_1 = __importDefault(require("chalk"));
var discord_js_1 = require("discord.js");
var config_1 = require("./config");
var database_1 = require("./db/database");
var dbRole_1 = require("./db/dbRole");
var dbUser_1 = require("./db/dbUser");
var userController_1 = require("./db/userController");
var sync_roles_1 = require("./system/sync_roles");
var voice_manager_1 = require("./system/voice_manager");
var commandUtil_1 = require("./util/commandUtil");
var style_1 = require("./util/style");
var dbBanned_1 = require("./db/dbBanned");
var bump_reminder_1 = require("./system/bump_reminder");
var client = new discord_js_1.Client({
    disabledEvents: ["TYPING_START"]
});
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.dbInit()];
                case 1:
                    _a.sent();
                    client.login(config_1.token);
                    return [2 /*return*/];
            }
        });
    });
}
client.on("ready", function () {
    //Get persistant roles
    dbRole_1.initRoles();
    //Sets up voice role when users are in voice
    voice_manager_1.initVoiceManager(client);
    dbBanned_1.initBanned();
    //Sync roles
    sync_roles_1.syncRoles(client);
    //Setup command files
    commandUtil_1.InitCommands();
    console.log(chalk_1.default.bgCyan.bold(client.user.username + " online!"));
});
client.on('raw', function (packet) {
    if (!["MESSAGE_REACTION_REMOVE"].includes(packet.t))
        return;
    var channel = client.channels.get(packet.d.channel_id);
    if (!channel)
        return console.log("channel not found in raw event");
    if (!(function (channel) { return channel.type === "text"; })(channel))
        return;
    //If the message is cached then dont emit since the event will fire anyway
    var message = channel.messages.get(packet.d.message_id);
    if (message) {
        HandleRawEvent(message, packet);
    }
    else {
        channel.fetchMessage(packet.d.message_id).then(function (message) {
            HandleRawEvent(message, packet);
        });
    }
});
function HandleRawEvent(message, packet) {
    // Emojis can have identifiers of name:id format, so we have to account for that case as well
    var emoji = packet.d.emoji.id ? packet.d.emoji.name + ":" + packet.d.emoji.id : packet.d.emoji.name;
    // This gives us the reaction we need to emit the event properly, in top of the message object
    var reaction = message.reactions.get(emoji);
    var user = client.users.get(packet.d.user_id);
    if (!user)
        return console.log("user not found in raw event");
    // Adds the currently reacting user to the reaction's users collection.
    if (reaction)
        reaction.users.set(packet.d.user_id, user);
    if (!reaction)
        return console.log("reaction undefined");
    if (packet.t === 'MESSAGE_REACTION_REMOVE') {
        sync_roles_1.OnReactionRemove(reaction, user);
    }
}
client.on("guildMemberAdd", function (member) {
    if (member.guild.id !== config_1.guild_id)
        return;
    console.log(chalk_1.default.bgBlue.bold("User joined " + member.user.tag));
    userController_1.getUser(member.user.id).then(function (user) {
        var guild = client.guilds.get(config_1.guild_id);
        if (!guild)
            return;
        var userRoles = user.roles;
        var rolesToAdd = [];
        var _loop_1 = function (i) {
            console.log(userRoles[i].roleId);
            var guildRole = member.guild.roles.find(function (r) { return r.name === userRoles[i].name; });
            if (guildRole && rolesToAdd.includes(guildRole) === false) {
                rolesToAdd.push(guildRole);
                console.log("added " + guildRole.name + " to user");
            }
        };
        for (var i = 0; i < userRoles.length; i++) {
            _loop_1(i);
        }
        member.addRoles(rolesToAdd);
        console.log("added roles to user " + member.displayName);
    }).catch(function () {
        var iuser = {
            username: member.user.username,
            tag: member.user.tag,
            userId: member.id,
            rapsheet: [],
            roles: []
        };
        member.roles.map(function (role) {
            if (dbRole_1.persistenRoles.has(role.id)) {
                iuser.roles.push({ name: role.name, roleId: role.id });
            }
        });
        dbUser_1.CreateUser(iuser);
    });
});
client.on("guildMemberRemove", function (member) {
    if (!member)
        return;
    if (member.guild.id !== config_1.guild_id)
        return;
    console.log(chalk_1.default.bgMagenta.bold("User left " + member.user.username));
    userController_1.getUser(member.user.id).then(function (user) {
        var guild = client.guilds.get(config_1.guild_id);
        if (!guild)
            return;
        user.roles = [];
        member.roles.map(function (role) {
            if (dbRole_1.persistenRoles.find(function (r) { return r.roleId === role.id; })) {
                user.roles.push({ name: role.name, roleId: role.id });
                console.log(role.name);
            }
        });
        userController_1.updateUser(member.user.id, user).then(function () { return console.log("updated user " + user.tag); })
            .catch(function (err) { return console.log("error while trying to update user"); });
    }).catch(function (err) {
        console.log(err);
        var iuser = {
            username: member.user.username,
            tag: member.user.tag,
            userId: member.id,
            rapsheet: [],
            roles: []
        };
        member.roles.map(function (role) {
            if (dbRole_1.persistenRoles.find(function (pr) { return pr.roleId === role.id; })) {
                iuser.roles.push({ name: role.name, roleId: role.id });
            }
        });
        dbUser_1.CreateUser(iuser);
    });
});
client.on("message", function (message) {
    if (message.author.bot || !message.content.startsWith(config_1.prefix)) {
        bump_reminder_1.OnMessageBot(message);
        return;
    }
    if (config_1.perms.find(function (p) { return message.member.roles.has(p.roleId); }) === undefined) {
        return;
    }
    var args = message.content.slice(config_1.prefix.length).split(/ +/);
    var commandName = args.shift();
    if (!commandName)
        return;
    if (commandName.startsWith(config_1.prefix))
        return;
    commandName = commandName.toLowerCase();
    var command = commandUtil_1.FindCommand(commandName);
    if (!command) {
        var grp = commandUtil_1.FindCommandGroup(commandName);
        if (grp) {
            commandName = args.shift();
            if (!commandName)
                return;
            command = grp.find(function (cmd) { return cmd.name.toLowerCase() === commandName || cmd.aliases && cmd.aliases.find(function (al) { return al === commandName; }); });
        }
    }
    if (!command)
        return style_1.QuickEmbed(message, "command " + style_1.wrap(commandName || "") + " not found");
    if (!commandUtil_1.HasPerms(message.member, command.name))
        return;
    if (command.args && args.length === 0) {
        var usageString = "Arguments required";
        var embed = new discord_js_1.RichEmbed();
        embed.setColor(style_1.embedColor);
        if (command.usage) {
            usageString = command.name + " ";
            usageString += style_1.wrap(command.usage, "`");
        }
        embed.addField("Arguments Required", usageString);
        return message.channel.send(embed);
    }
    try {
        command.execute(message, args);
    }
    catch (err) {
        console.error(err);
    }
});
init();
