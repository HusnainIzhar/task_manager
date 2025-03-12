"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_config_1 = require("./config/db.config");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    (0, db_config_1.connectDB)();
});
