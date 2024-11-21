import { afterNextRender, AfterRenderPhase, Directive, ElementRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
export class BaseTourProxyAnchor {
    constructor() {
        this.document = inject(DOCUMENT);
        afterNextRender(() => this.setAnchorElement(), {
            phase: AfterRenderPhase.Read
        });
    }
    setAnchorElement() {
        if (this.anchorEl instanceof HTMLElement) {
            this.anchorDirective.element = new ElementRef(this.anchorEl);
            return;
        }
        const htmlElement = this.document.querySelector(this.anchorEl);
        if (!htmlElement) {
            throw new Error(`Element with "${this.anchorEl}" CSS selector could not be found!`);
        }
        this.anchorDirective.element = new ElementRef(htmlElement);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: BaseTourProxyAnchor, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.12", type: BaseTourProxyAnchor, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: BaseTourProxyAnchor, decorators: [{
            type: Directive
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS10b3VyLXByb3h5LWFuY2hvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC11aS10b3VyLWNvcmUvc3JjL2xpYi9iYXNlLXRvdXItcHJveHktYW5jaG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFL0YsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDOztBQUd6QyxNQUFNLE9BQWdCLG1CQUFtQjtJQU9yQztRQUppQixhQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBS3pDLGVBQWUsQ0FDWCxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtZQUMzQixLQUFLLEVBQUUsZ0JBQWdCLENBQUMsSUFBSTtTQUMvQixDQUNKLENBQUM7SUFDTixDQUFDO0lBRU8sZ0JBQWdCO1FBQ3BCLElBQUksSUFBSSxDQUFDLFFBQVEsWUFBWSxXQUFXLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sR0FBRyxJQUFJLFVBQVUsQ0FBYyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUUsT0FBTztRQUNYLENBQUM7UUFDRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBYyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFNUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLFFBQVEsb0NBQW9DLENBQUMsQ0FBQztRQUN4RixDQUFDO1FBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxVQUFVLENBQWMsV0FBVyxDQUFDLENBQUM7SUFDNUUsQ0FBQzsrR0EzQmlCLG1CQUFtQjttR0FBbkIsbUJBQW1COzs0RkFBbkIsbUJBQW1CO2tCQUR4QyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthZnRlck5leHRSZW5kZXIsIEFmdGVyUmVuZGVyUGhhc2UsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgaW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VG91ckFuY2hvckRpcmVjdGl2ZX0gZnJvbSAnLi90b3VyLWFuY2hvci5kaXJlY3RpdmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVRvdXJQcm94eUFuY2hvciB7XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgYW5jaG9yRGlyZWN0aXZlOiBUb3VyQW5jaG9yRGlyZWN0aXZlO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuXG4gICAgcHVibGljIGFic3RyYWN0IGFuY2hvckVsOiBzdHJpbmcgfCBIVE1MRWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBhZnRlck5leHRSZW5kZXIoXG4gICAgICAgICAgICAoKSA9PiB0aGlzLnNldEFuY2hvckVsZW1lbnQoKSwge1xuICAgICAgICAgICAgICAgIHBoYXNlOiBBZnRlclJlbmRlclBoYXNlLlJlYWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEFuY2hvckVsZW1lbnQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmFuY2hvckVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuYW5jaG9yRGlyZWN0aXZlLmVsZW1lbnQgPSBuZXcgRWxlbWVudFJlZjxIVE1MRWxlbWVudD4odGhpcy5hbmNob3JFbCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaHRtbEVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHRoaXMuYW5jaG9yRWwpO1xuXG4gICAgICAgIGlmICghaHRtbEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCB3aXRoIFwiJHt0aGlzLmFuY2hvckVsfVwiIENTUyBzZWxlY3RvciBjb3VsZCBub3QgYmUgZm91bmQhYCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFuY2hvckRpcmVjdGl2ZS5lbGVtZW50ID0gbmV3IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KGh0bWxFbGVtZW50KTtcbiAgICB9XG5cbn1cbiJdfQ==