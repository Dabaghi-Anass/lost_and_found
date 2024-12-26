// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const dotenv = require("dotenv");
dotenv.config();

const config = getDefaultConfig(__dirname, {
	isCSSEnabled: true,
});
config.resolver.sourceExts.push("cjs");
module.exports = withNativeWind(config, {
	input: "./assets/styles/global.css",
});
