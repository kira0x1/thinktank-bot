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
var database_1 = require("./database");
var dbBanned_1 = require("./dbBanned");
exports.allBanned = function () {
    return new Promise(function (resolve, reject) {
        var banned = dbBanned_1.bannedModel.find(function (err, users) {
            if (err)
                reject(err);
            else
                resolve(users);
        });
    });
};
// - GET - /user/{1} # returns user with userId 1
function getBanned(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    return __awaiter(this, void 0, void 0, function () {
                        var bannedModel;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    bannedModel = database_1.conn.model("banned", dbBanned_1.BannedSchema);
                                    return [4 /*yield*/, bannedModel.findOne({ userId: id }, function (err, user) {
                                            if (err || user === null)
                                                reject(err);
                                            else
                                                resolve(user);
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                })];
        });
    });
}
exports.getBanned = getBanned;
// - PUT - /user # inserts a new user into the table
function addBan(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    return __awaiter(this, void 0, void 0, function () {
                        var bannedModel;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, database_1.conn.model("banned", dbBanned_1.BannedSchema)];
                                case 1:
                                    bannedModel = _a.sent();
                                    return [4 /*yield*/, bannedModel.create({ userId: id }).then(function (user) {
                                            resolve(user);
                                        }).catch(function (err) { return reject(err); })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                })];
        });
    });
}
exports.addBan = addBan;
function deleteBan(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    return __awaiter(this, void 0, void 0, function () {
                        var bannedModel;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, database_1.conn.model("banned", dbBanned_1.BannedSchema)];
                                case 1:
                                    bannedModel = _a.sent();
                                    bannedModel.deleteOne({ userId: id }, function (err) {
                                        if (err) {
                                            reject(err);
                                        }
                                        else {
                                            resolve("Successfuly Deleted User");
                                        }
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    });
                })];
        });
    });
}
exports.deleteBan = deleteBan;
