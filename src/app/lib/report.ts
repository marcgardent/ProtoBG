

export interface IMessage {
    message: string;
    entry: any;
    raw?: any;
    url?: string;
}



export interface IMessenger {

    error(m: IMessage);
}