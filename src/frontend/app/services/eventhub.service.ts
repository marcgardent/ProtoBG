import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConsoleLevel, IConsole, IConsoleEntry } from 'src/core/report';
@Injectable({
  providedIn: 'root'
})
export class EventHubService implements IConsole {


  public logs = new Array<IConsoleEntry>();
  public resizingArea = new Subject<void>();
  public resizeArea = new Subject<void>();
  private _onConsoleEntry = new Subject<IConsoleEntry>();
  private _onSnackEntry = new Subject<string>();

  public get onConsoleEntry() { return this._onConsoleEntry.asObservable(); }
  public get onSnackEntry() { return this._onSnackEntry.asObservable(); }

  private message(level: ConsoleLevel, channel: string,  message: string): void {
    const entry: IConsoleEntry = {
      date: Date.now(),
      channel: channel,
      message: message,
      level: level,
    }

    this._onConsoleEntry.next(entry);
    this.logs.push(entry);
  }

  public raiseError(message: string) {
    this.snack(message);
  }

  public raiseSuccess(message: string) {
    this.snack(message);
  }

  public snack(message: string) {
    this._onSnackEntry.next(message);
  }

  public error(channel: string, message: string) {
    this.message(ConsoleLevel.error, channel, message)
  }

  public success(channel: string,  message: string) {
    this.message(ConsoleLevel.success, channel, message)
  }

  public debug(channel: string,  message: string) {
    this.message(ConsoleLevel.debug, channel, message)
  }

  public fatal(channel: string,  message: string) {
    this.message(ConsoleLevel.fatal, channel, message)
  }

  public verbose(channel: string,  message: string) {
    this.message(ConsoleLevel.verbose, channel, message)
  }

  public warning(channel: string,  message: string) {
    this.message(ConsoleLevel.warning, channel, message)
  }
}
