"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bolt_1 = require("@slack/bolt");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize the Bolt app with the token and signing secret
const app = new bolt_1.App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    logLevel: bolt_1.LogLevel.DEBUG,
});
app.message(({ message }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(message);
}));
// Listens to incoming messages that contain "hello"
app.message("hello", ({ message, say }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(message);
    // say() sends a message to the channel where the event was triggered
    yield say(`Hey there!`);
}));
app.error((error) => __awaiter(void 0, void 0, void 0, function* () {
    // Check the details of the error to handle cases where you should retry sending a message or stop the app
    console.error(error);
}));
// Starts the app
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield app.start();
    console.log("⚡️ Bolt app is running!");
}))();
