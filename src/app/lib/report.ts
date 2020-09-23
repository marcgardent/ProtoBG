

export interface IMessage {
    message: string;
    entry: any;
    raw?: any;
}



export interface IMessenger {

    error(m: IMessage);
}