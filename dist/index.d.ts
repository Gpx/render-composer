import type { ReactNode } from "react";
declare type Data = Object | (() => Object);
export declare type UI = (ui: ReactNode, data: Data) => ReactNode;
declare class Wrap {
    ui: UI;
    childWrap: Wrap;
    data: Data;
    constructor({ ui, childWrap, data, }: {
        ui: UI;
        childWrap?: Wrap;
        data?: Data;
    });
    __render(child: any, data: any): {
        ui: any;
        data: any;
    };
    wraps(childWrap: Wrap): any;
    defaultData(data: Data): any;
    withRenderMethod(render: any, opts?: any): (child: any, data?: {}) => any;
}
export default function wrap(ui: UI): Wrap;
export {};
