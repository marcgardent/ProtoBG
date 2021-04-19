import { Type } from "@angular/core";

export interface WindowDeclaration {
    body: Type<any>;
    header: Type<any>;
    icon: string, name: string;
}

export interface BodyComponent {
    link(header: any);
}