import * as i0 from "@angular/core";
export interface ScrollOptions {
    center: boolean;
    smoothScroll: boolean;
    scrollContainer?: string | HTMLElement;
}
export declare class ScrollingService {
    private readonly platformId;
    private readonly isBrowser;
    private readonly document;
    private readonly window;
    private scrollOptions;
    private anchorEl;
    ensureVisible(anchorElement: HTMLElement, options: ScrollOptions): Promise<void>;
    private get waitForScrollFinish$();
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ScrollingService>;
}
