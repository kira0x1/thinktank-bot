"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
exports.assetsPath = path_1.default.join(__dirname, '../../assets/');
exports.heartImage = path_1.default.join(exports.assetsPath, 'heart.gif');
exports.loadingImage = path_1.default.join(exports.assetsPath, 'loading.gif');
