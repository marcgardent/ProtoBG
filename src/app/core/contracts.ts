import { Type, OnDestroy, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';

/**
 * Seamless unsubscribe management
 */
@Injectable()
export abstract class ComponentBase {

    destroy$: Subject<boolean> = new Subject<boolean>();
    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public takeUntilOnDestroy() {
        return takeUntil(this.destroy$)
    }

    public subUntilOnDestroy(subject : Subject<any>|Observable<any>, callback : any) {
        subject.pipe(this.takeUntilOnDestroy()).subscribe(callback);
    }
}

export interface WindowDeclaration {
    body: Type<any>;
    header: Type<any>;
    icon: string, name: string;
}

export interface BodyComponent {
    link(header: any);
}