import { TourAnchorDirective } from './tour-anchor.directive';
import * as i0 from "@angular/core";
export declare abstract class BaseTourProxyAnchor {
    protected abstract readonly anchorDirective: TourAnchorDirective;
    private readonly document;
    abstract anchorEl: string | HTMLElement;
    constructor();
    private setAnchorElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseTourProxyAnchor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseTourProxyAnchor, never, never, {}, {}, never, never, false, never>;
}
