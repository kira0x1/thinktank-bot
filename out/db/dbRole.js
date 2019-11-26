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
var mongoose_1 = require("mongoose");
var database_1 = require("./database");
exports.persistenRoles = new discord_js_1.Collection();
exports.RoleSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    roleId: { type: String, required: true },
    createdAt: Date
});
exports.roleModel = mongoose_1.model("roles", exports.RoleSchema);
//Create a UserModel and insert it into the database, returns an error if the user already exists
function CreateRole(role) {
    var roleModel = database_1.conn.model("roles", exports.RoleSchema);
    roleModel.create({ name: role.name, roleId: role.roleId })
        .then(function () { return console.log("Created role " + role.name); })
        .catch(function (err) { return console.log("Error while trying to create role\n\n" + err); });
}
exports.CreateRole = CreateRole;
function initRoles() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            database_1.conn.db.collections().then(function (collections) { return __awaiter(_this, void 0, void 0, function () {
                var roles;
                return __generator(this, function (_a) {
                    roles = collections.find(function (col) { return col.collectionName === "roles"; });
                    if (!roles)
                        return [2 /*return*/, console.log("couldnt find roles")];
                    roles.find().toArray().then(function (roleArray) {
                        roleArray.map(function (role) {
                            exports.persistenRoles.set(role.roleId, { name: role.name, roleId: role.roleId });
                        });
                    });
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/];
        });
    });
}
exports.initRoles = initRoles;
