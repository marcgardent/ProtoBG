

export interface IMessage {
    message: string;
    entry: any;
    raw?: any;
    url?: string;
}

export interface IMessenger {
    error(m: IMessage);
}

export enum ConsoleLevel {
    debug = "debug",
    verbose = "verbose",
    warning = "warning",
    error = "error",
    success = "success",
    fatal = "fatal",
}

export interface IConsoleEntry {
    date: number;
    channel: string;
    message: string;
    level: ConsoleLevel;
}

export interface IConsole {
    debug(channel: string, message: string);
    verbose(channel: string, message: string);
    warning(channel: string, message: string);
    error(channel: string, message: string);
    success(channel: string, message: string);
    fatal(channel: string, message: string);
    snack(message: string);
}

export class SilentConsole implements IConsole {
    snack(message: string) {

    }
    debug(channel: string, message: string) {

    }
    verbose(channel: string, message: string) {

    }
    warning(channel: string,message: string) {

    }
    error(channel: string, message: string) {

    }
    success(channel: string, message: string) {

    }
    fatal(channel: string, message: string) {

    }

}

export class NativeConsole implements IConsole {
    snack(message: string) {
        console.log(message);
    }

    debug(channel: string, message: string) {
        console.debug(`${channel}: ${message}`);
    }

    verbose(channel: string, message: string) {
        console.trace(`${channel}: ${message}`);
    }

    warning(channel: string, message: string) {
        console.warn(`${channel}: ${message}`);
    }

    error(channel: string, message: string) {
        console.error(`${channel}: ${message}`);
    }

    success(channel: string,  message: string) {
        console.info(`${channel}: ${message}`);
    }

    fatal(channel: string,  message: string) {
        console.exception(`${channel}: ${message}`);
    }

}
