import { BaseTourProxyAnchor } from 'ngx-ui-tour-core';
import { TourAnchorMatMenuDirective } from './tour-anchor.directive';
import * as i0 from "@angular/core";
import * as i1 from "./tour-anchor.directive";
export declare class TourProxyAnchorComponent extends BaseTourProxyAnchor {
    protected readonly anchorDirective: TourAnchorMatMenuDirective;
    anchorEl: string | HTMLElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<TourProxyAnchorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TourProxyAnchorComponent, "tour-proxy-anchor", never, { "anchorEl": { "alias": "anchorEl"; "required": true; }; }, {}, never, never, true, [{ directive: typeof i1.TourAnchorMatMenuDirective; inputs: { "tourAnchor": "anchorId"; }; outputs: {}; }]>;
}
