import { injectable } from "@mainsail/container";

@injectable()
export class Logger {
    line(): void {
        console.log("-------------------------------");
    }

    header(title: string): void {
        this.line();
        console.log(`--- ${title} ---`);
        this.line();
    }

    logKV(key: string, value: string): void {
        console.log(`${key}: ${value}`);
    }

    log(message: string): void {
        console.log(message);
    }
}
