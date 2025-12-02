import { ArgsAndFlags } from "./types.js";

export const getArgsAndFlags = (customArgs?: string[]): ArgsAndFlags => {
    const allArgs = customArgs ? customArgs : process.argv.slice(2);
    const args = allArgs.filter((arg) => !arg.startsWith("--"));
    const flags = {};
    allArgs
        .filter((arg) => arg.startsWith("--"))
        .forEach((arg) => {
            const [key, value] = arg.slice(2).split("=");
            flags[key] = value;
        });

    return { args, flags };
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
