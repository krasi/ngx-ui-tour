import { Directive, HostBinding, Input } from '@angular/core';
import { TourState } from 'ngx-ui-tour-core';
import { first } from 'rxjs';
import { TourAnchorOpenerComponent } from './tour-anchor-opener.component';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-md-menu-tour.service";
import * as i2 from "./tour-step-template.service";
export class TourAnchorMatMenuDirective {
    constructor(viewContainer, element, tourService, tourStepTemplate) {
        this.viewContainer = viewContainer;
        this.element = element;
        this.tourService = tourService;
        this.tourStepTemplate = tourStepTemplate;
    }
    ngOnInit() {
        this.tourService.register(this.tourAnchor, this);
    }
    ngOnDestroy() {
        this.tourService.unregister(this.tourAnchor);
    }
    createOpener() {
        this.opener = this.viewContainer.createComponent(TourAnchorOpenerComponent).instance;
    }
    // noinspection JSUnusedGlobalSymbols
    showTourStep(step) {
        this.isActive = true;
        this.tourStepTemplate.templateComponent.step = step;
        if (!this.opener) {
            this.createOpener();
        }
        const trigger = this.opener.trigger, customTrigger = trigger;
        customTrigger._element = this.element;
        // Fixes tour step closing when hovering over mat-menu item, issue #123
        customTrigger._parentMaterialMenu = null;
        // Overrides position setting to support opening to the sides
        customTrigger._setPosition = (menu, positionStrategy) => this.setPosition(menu, positionStrategy, step);
        const menu = this.tourStepTemplate.templateComponent.tourStep;
        trigger.menu = menu;
        menu.xPosition = step.placement?.xPosition || 'after';
        menu.yPosition = step.placement?.yPosition || 'below';
        menu.hasBackdrop = !!step.closeOnOutsideClick;
        const popoverClass = step.popoverClass ?? '', arrow = step.showArrow ? 'arrow' : '', horizontal = step.placement?.horizontal ? 'horizontal' : '';
        menu.panelClass = `tour-step ${popoverClass} ${arrow} ${horizontal}`;
        trigger.openMenu();
        if (this.menuCloseSubscription) {
            this.menuCloseSubscription.unsubscribe();
        }
        this.menuCloseSubscription = trigger.menuClosed
            .pipe(first())
            .subscribe(() => {
            if (this.tourService.getStatus() !== TourState.OFF) {
                this.tourService.end();
            }
        });
    }
    setPosition(menu, positionStrategy, step) {
        let [originX, originFallbackX] = menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'];
        const [overlayY, overlayFallbackY] = menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];
        let [originY, originFallbackY] = [overlayY, overlayFallbackY];
        let [overlayX, overlayFallbackX] = [originX, originFallbackX];
        const isHorizontal = step.placement?.horizontal;
        if (isHorizontal) {
            overlayFallbackX = originX = menu.xPosition === 'before' ? 'start' : 'end';
            originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
        }
        else if (!menu.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }
        const offset = step.backdropConfig?.offset ?? 0, offsetX = isHorizontal ? offset : -offset, offsetY = isHorizontal ? -offset : offset;
        const original = { originX, originY, overlayX, overlayY, offsetX, offsetY };
        const flipX = {
            originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY,
            offsetX: -offsetX, offsetY
        };
        const flipY = {
            originX, originY: originFallbackY, overlayX, overlayY: overlayFallbackY, offsetX, offsetY: -offsetY
        };
        const flipXY = {
            originX: originFallbackX, originY: originFallbackY, overlayX: overlayFallbackX, overlayY: overlayFallbackY,
            offsetX: -offsetX, offsetY: -offsetY
        };
        positionStrategy.withPositions(isHorizontal ? [original, flipX] : [original, flipY, flipXY]);
    }
    // noinspection JSUnusedGlobalSymbols
    hideTourStep() {
        this.isActive = false;
        if (this.menuCloseSubscription) {
            this.menuCloseSubscription.unsubscribe();
        }
        this.opener.trigger.closeMenu();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourAnchorMatMenuDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i1.NgxmTourService }, { token: i2.TourStepTemplateService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.12", type: TourAnchorMatMenuDirective, isStandalone: true, selector: "[tourAnchor]", inputs: { tourAnchor: "tourAnchor" }, host: { properties: { "class.touranchor--is-active": "this.isActive" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourAnchorMatMenuDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tourAnchor]',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i1.NgxmTourService }, { type: i2.TourStepTemplateService }], propDecorators: { tourAnchor: [{
                type: Input
            }], isActive: [{
                type: HostBinding,
                args: ['class.touranchor--is-active']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91ci1hbmNob3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVpLXRvdXItbWQtbWVudS9zcmMvbGliL3RvdXItYW5jaG9yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUMsU0FBUyxFQUFjLFdBQVcsRUFBRSxLQUFLLEVBQW1CLE1BQU0sZUFBZSxDQUFDO0FBQzFGLE9BQU8sRUFBc0IsU0FBUyxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDaEUsT0FBTyxFQUFDLEtBQUssRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUV6QyxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQzs7OztBQWlCekUsTUFBTSxPQUFPLDBCQUEwQjtJQVVuQyxZQUNZLGFBQStCLEVBQ2hDLE9BQW1CLEVBQ2xCLFdBQTRCLEVBQzVCLGdCQUF5QztRQUh6QyxrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFDaEMsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNsQixnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7UUFDNUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF5QjtJQUNsRCxDQUFDO0lBRUosUUFBUTtRQUNKLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVPLFlBQVk7UUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUN6RixDQUFDO0lBRUQscUNBQXFDO0lBQ3JDLFlBQVksQ0FBQyxJQUFtQjtRQUM1QixJQUFJLENBQUMsUUFB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtPbkRlc3Ryb3ksIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdEJpbmRpbmcsIElucHV0LCBWaWV3Q29udGFpbmVyUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VG91ckFuY2hvckRpcmVjdGl2ZSwgVG91clN0YXRlfSBmcm9tICduZ3gtdWktdG91ci1jb3JlJztcbmltcG9ydCB7Zmlyc3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7VG91ckFuY2hvck9wZW5lckNvbXBvbmVudH0gZnJvbSAnLi90b3VyLWFuY2hvci1vcGVuZXIuY29tcG9uZW50JztcbmltcG9ydCB7VG91clN0ZXBUZW1wbGF0ZVNlcnZpY2V9IGZyb20gJy4vdG91ci1zdGVwLXRlbXBsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHtOZ3htVG91clNlcnZpY2V9IGZyb20gJy4vbmd4LW1kLW1lbnUtdG91ci5zZXJ2aWNlJztcbmltcG9ydCB7SU1kU3RlcE9wdGlvbn0gZnJvbSAnLi9zdGVwLW9wdGlvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHtNYXRNZW51LCBNYXRNZW51UGFuZWx9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnO1xuaW1wb3J0IHtGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksIEhvcml6b250YWxDb25uZWN0aW9uUG9zLCBWZXJ0aWNhbENvbm5lY3Rpb25Qb3N9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcblxuaW50ZXJmYWNlIEN1c3RvbU1lbnVUcmlnZ2VyIHtcbiAgICBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gICAgX3BhcmVudE1hdGVyaWFsTWVudTogTWF0TWVudTtcbiAgICBfc2V0UG9zaXRpb246IChtZW51OiBNYXRNZW51UGFuZWwsIHBvc2l0aW9uU3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkgPT4gdm9pZFxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1t0b3VyQW5jaG9yXScsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZVxufSlcbmV4cG9ydCBjbGFzcyBUb3VyQW5jaG9yTWF0TWVudURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBUb3VyQW5jaG9yRGlyZWN0aXZlIHtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRvdXJBbmNob3I6IHN0cmluZztcblxuICAgIHB1YmxpYyBvcGVuZXI6IFRvdXJBbmNob3JPcGVuZXJDb21wb25lbnQ7XG4gICAgcHVibGljIG1lbnVDbG9zZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy50b3VyYW5jaG9yLS1pcy1hY3RpdmUnKSBwdWJsaWMgaXNBY3RpdmU6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICAgICAgcHJpdmF0ZSB0b3VyU2VydmljZTogTmd4bVRvdXJTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHRvdXJTdGVwVGVtcGxhdGU6IFRvdXJTdGVwVGVtcGxhdGVTZXJ2aWNlXG4gICAgKSB7fVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudG91clNlcnZpY2UucmVnaXN0ZXIodGhpcy50b3VyQW5jaG9yLCB0aGlzKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50b3VyU2VydmljZS51bnJlZ2lzdGVyKHRoaXMudG91ckFuY2hvcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVPcGVuZXIoKSB7XG4gICAgICAgIHRoaXMub3BlbmVyID0gdGhpcy52aWV3Q29udGFpbmVyLmNyZWF0ZUNvbXBvbmVudChUb3VyQW5jaG9yT3BlbmVyQ29tcG9uZW50KS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG4gICAgc2hvd1RvdXJTdGVwKHN0ZXA6IElNZFN0ZXBPcHRpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMudG91clN0ZXBUZW1wbGF0ZS50ZW1wbGF0ZUNvbXBvbmVudC5zdGVwID0gc3RlcDtcblxuICAgICAgICBpZiAoIXRoaXMub3BlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZU9wZW5lcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IHRoaXMub3BlbmVyLnRyaWdnZXIsXG4gICAgICAgICAgICBjdXN0b21UcmlnZ2VyID0gdHJpZ2dlciBhcyB1bmtub3duIGFzIEN1c3RvbU1lbnVUcmlnZ2VyO1xuICAgICAgICBjdXN0b21UcmlnZ2VyLl9lbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICAvLyBGaXhlcyB0b3VyIHN0ZXAgY2xvc2luZyB3aGVuIGhvdmVyaW5nIG92ZXIgbWF0LW1lbnUgaXRlbSwgaXNzdWUgIzEyM1xuICAgICAgICBjdXN0b21UcmlnZ2VyLl9wYXJlbnRNYXRlcmlhbE1lbnUgPSBudWxsO1xuICAgICAgICAvLyBPdmVycmlkZXMgcG9zaXRpb24gc2V0dGluZyB0byBzdXBwb3J0IG9wZW5pbmcgdG8gdGhlIHNpZGVzXG4gICAgICAgIGN1c3RvbVRyaWdnZXIuX3NldFBvc2l0aW9uID0gKG1lbnUsIHBvc2l0aW9uU3RyYXRlZ3kpID0+IHRoaXMuc2V0UG9zaXRpb24obWVudSwgcG9zaXRpb25TdHJhdGVneSwgc3RlcCk7XG5cbiAgICAgICAgY29uc3QgbWVudSA9IHRoaXMudG91clN0ZXBUZW1wbGF0ZS50ZW1wbGF0ZUNvbXBvbmVudC50b3VyU3RlcDtcbiAgICAgICAgdHJpZ2dlci5tZW51ID0gbWVudTtcbiAgICAgICAgbWVudS54UG9zaXRpb24gPSBzdGVwLnBsYWNlbWVudD8ueFBvc2l0aW9uIHx8ICdhZnRlcic7XG4gICAgICAgIG1lbnUueVBvc2l0aW9uID0gc3RlcC5wbGFjZW1lbnQ/LnlQb3NpdGlvbiB8fCAnYmVsb3cnO1xuICAgICAgICBtZW51Lmhhc0JhY2tkcm9wID0gISFzdGVwLmNsb3NlT25PdXRzaWRlQ2xpY2s7XG5cbiAgICAgICAgY29uc3QgcG9wb3ZlckNsYXNzID0gc3RlcC5wb3BvdmVyQ2xhc3MgPz8gJycsXG4gICAgICAgICAgICBhcnJvdyA9IHN0ZXAuc2hvd0Fycm93ID8gJ2Fycm93JyA6ICcnLFxuICAgICAgICAgICAgaG9yaXpvbnRhbCA9IHN0ZXAucGxhY2VtZW50Py5ob3Jpem9udGFsID8gJ2hvcml6b250YWwnIDogJyc7XG5cbiAgICAgICAgbWVudS5wYW5lbENsYXNzID0gYHRvdXItc3RlcCAke3BvcG92ZXJDbGFzc30gJHthcnJvd30gJHtob3Jpem9udGFsfWA7XG4gICAgICAgIHRyaWdnZXIub3Blbk1lbnUoKTtcblxuICAgICAgICBpZiAodGhpcy5tZW51Q2xvc2VTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMubWVudUNsb3NlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tZW51Q2xvc2VTdWJzY3JpcHRpb24gPSB0cmlnZ2VyLm1lbnVDbG9zZWRcbiAgICAgICAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b3VyU2VydmljZS5nZXRTdGF0dXMoKSAhPT0gVG91clN0YXRlLk9GRikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdXJTZXJ2aWNlLmVuZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0UG9zaXRpb24obWVudTogTWF0TWVudVBhbmVsLCBwb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksIHN0ZXA6IElNZFN0ZXBPcHRpb24pIHtcbiAgICAgICAgbGV0IFtvcmlnaW5YLCBvcmlnaW5GYWxsYmFja1hdOiBIb3Jpem9udGFsQ29ubmVjdGlvblBvc1tdID1cbiAgICAgICAgICAgIG1lbnUueFBvc2l0aW9uID09PSAnYmVmb3JlJyA/IFsnZW5kJywgJ3N0YXJ0J10gOiBbJ3N0YXJ0JywgJ2VuZCddO1xuXG4gICAgICAgIGNvbnN0IFtvdmVybGF5WSwgb3ZlcmxheUZhbGxiYWNrWV06IFZlcnRpY2FsQ29ubmVjdGlvblBvc1tdID1cbiAgICAgICAgICAgIG1lbnUueVBvc2l0aW9uID09PSAnYWJvdmUnID8gWydib3R0b20nLCAndG9wJ10gOiBbJ3RvcCcsICdib3R0b20nXTtcblxuICAgICAgICBsZXQgW29yaWdpblksIG9yaWdpbkZhbGxiYWNrWV0gPSBbb3ZlcmxheVksIG92ZXJsYXlGYWxsYmFja1ldO1xuICAgICAgICBsZXQgW292ZXJsYXlYLCBvdmVybGF5RmFsbGJhY2tYXSA9IFtvcmlnaW5YLCBvcmlnaW5GYWxsYmFja1hdO1xuICAgICAgICBjb25zdCBpc0hvcml6b250YWwgPSBzdGVwLnBsYWNlbWVudD8uaG9yaXpvbnRhbDtcblxuICAgICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XG4gICAgICAgICAgICBvdmVybGF5RmFsbGJhY2tYID0gb3JpZ2luWCA9IG1lbnUueFBvc2l0aW9uID09PSAnYmVmb3JlJyA/ICdzdGFydCcgOiAnZW5kJztcbiAgICAgICAgICAgIG9yaWdpbkZhbGxiYWNrWCA9IG92ZXJsYXlYID0gb3JpZ2luWCA9PT0gJ2VuZCcgPyAnc3RhcnQnIDogJ2VuZCc7XG4gICAgICAgIH0gZWxzZSBpZiAoIW1lbnUub3ZlcmxhcFRyaWdnZXIpIHtcbiAgICAgICAgICAgIG9yaWdpblkgPSBvdmVybGF5WSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgICAgICAgICAgb3JpZ2luRmFsbGJhY2tZID0gb3ZlcmxheUZhbGxiYWNrWSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gc3RlcC5iYWNrZHJvcENvbmZpZz8ub2Zmc2V0ID8/IDAsXG4gICAgICAgICAgICBvZmZzZXRYID0gaXNIb3Jpem9udGFsID8gb2Zmc2V0IDogLW9mZnNldCxcbiAgICAgICAgICAgIG9mZnNldFkgPSBpc0hvcml6b250YWwgPyAtb2Zmc2V0IDogb2Zmc2V0O1xuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsID0ge29yaWdpblgsIG9yaWdpblksIG92ZXJsYXlYLCBvdmVybGF5WSwgb2Zmc2V0WCwgb2Zmc2V0WX07XG4gICAgICAgIGNvbnN0IGZsaXBYID0ge1xuICAgICAgICAgICAgb3JpZ2luWDogb3JpZ2luRmFsbGJhY2tYLCBvcmlnaW5ZLCBvdmVybGF5WDogb3ZlcmxheUZhbGxiYWNrWCwgb3ZlcmxheVksXG4gICAgICAgICAgICBvZmZzZXRYOiAtb2Zmc2V0WCwgb2Zmc2V0WVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBmbGlwWSA9IHtcbiAgICAgICAgICAgIG9yaWdpblgsIG9yaWdpblk6IG9yaWdpbkZhbGxiYWNrWSwgb3ZlcmxheVgsIG92ZXJsYXlZOiBvdmVybGF5RmFsbGJhY2tZLCBvZmZzZXRYLCBvZmZzZXRZOiAtb2Zmc2V0WVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBmbGlwWFkgPSB7XG4gICAgICAgICAgICBvcmlnaW5YOiBvcmlnaW5GYWxsYmFja1gsIG9yaWdpblk6IG9yaWdpbkZhbGxiYWNrWSwgb3ZlcmxheVg6IG92ZXJsYXlGYWxsYmFja1gsIG92ZXJsYXlZOiBvdmVybGF5RmFsbGJhY2tZLFxuICAgICAgICAgICAgb2Zmc2V0WDogLW9mZnNldFgsIG9mZnNldFk6IC1vZmZzZXRZXG4gICAgICAgIH07XG5cbiAgICAgICAgcG9zaXRpb25TdHJhdGVneS53aXRoUG9zaXRpb25zKGlzSG9yaXpvbnRhbCA/IFtvcmlnaW5hbCwgZmxpcFhdIDogW29yaWdpbmFsLCBmbGlwWSwgZmxpcFhZXSk7XG4gICAgfVxuXG4gICAgLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuICAgIHB1YmxpYyBoaWRlVG91clN0ZXAoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMubWVudUNsb3NlU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm1lbnVDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3BlbmVyLnRyaWdnZXIuY2xvc2VNZW51KCk7XG4gICAgfVxuXG59XG4iXX0=