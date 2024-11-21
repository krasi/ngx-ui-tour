import { Component, HostListener } from '@angular/core';
import { TourState } from './tour.service';
import * as i0 from "@angular/core";
import * as i1 from "./tour.service";
export class TourHotkeyListenerComponent {
    constructor(tourService) {
        this.tourService = tourService;
    }
    /**
     * Configures hot keys for controlling the tour with the keyboard
     */
    onEscapeKey() {
        if (this.tourService.getStatus() === TourState.ON &&
            this.tourService.isHotkeysEnabled()) {
            this.tourService.end();
        }
    }
    onArrowRightKey() {
        const step = this.tourService.currentStep;
        if (this.tourService.getStatus() === TourState.ON &&
            this.tourService.hasNext(this.tourService.currentStep) &&
            this.tourService.isHotkeysEnabled() &&
            !step?.nextOnAnchorClick) {
            this.tourService.next();
        }
    }
    onArrowLeftKey() {
        if (this.tourService.getStatus() === TourState.ON &&
            this.tourService.hasPrev(this.tourService.currentStep) &&
            this.tourService.isHotkeysEnabled()) {
            this.tourService.prev();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourHotkeyListenerComponent, deps: [{ token: i1.TourService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.12", type: TourHotkeyListenerComponent, isStandalone: true, selector: "tour-hotkey-listener", host: { listeners: { "window:keydown.Escape": "onEscapeKey()", "window:keydown.ArrowRight": "onArrowRightKey()", "window:keydown.ArrowLeft": "onArrowLeftKey()" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourHotkeyListenerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'tour-hotkey-listener',
                    template: `<ng-content></ng-content>`,
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i1.TourService }], propDecorators: { onEscapeKey: [{
                type: HostListener,
                args: ['window:keydown.Escape']
            }], onArrowRightKey: [{
                type: HostListener,
                args: ['window:keydown.ArrowRight']
            }], onArrowLeftKey: [{
                type: HostListener,
                args: ['window:keydown.ArrowLeft']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91ci1ob3RrZXktbGlzdGVuZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVpLXRvdXItY29yZS9zcmMvbGliL3RvdXItaG90a2V5LWxpc3RlbmVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQWMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQVF0RCxNQUFNLE9BQU8sMkJBQTJCO0lBRXBDLFlBQ29CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQ3pDLENBQUM7SUFFSjs7T0FFRztJQUVJLFdBQVc7UUFDZCxJQUNJLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssU0FBUyxDQUFDLEVBQUU7WUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUNyQyxDQUFDO1lBQ0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMzQixDQUFDO0lBQ0wsQ0FBQztJQUdNLGVBQWU7UUFDbEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7UUFFMUMsSUFDSSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxFQUFFO1lBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO1lBQ3RELElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7WUFDbkMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQzFCLENBQUM7WUFDQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLENBQUM7SUFDTCxDQUFDO0lBR00sY0FBYztRQUNqQixJQUNJLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssU0FBUyxDQUFDLEVBQUU7WUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7WUFDdEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUNyQyxDQUFDO1lBQ0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1QixDQUFDO0lBQ0wsQ0FBQzsrR0ExQ1EsMkJBQTJCO21HQUEzQiwyQkFBMkIscVBBSDFCLDJCQUEyQjs7NEZBRzVCLDJCQUEyQjtrQkFMdkMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxVQUFVLEVBQUUsSUFBSTtpQkFDbkI7Z0ZBV1UsV0FBVztzQkFEakIsWUFBWTt1QkFBQyx1QkFBdUI7Z0JBVzlCLGVBQWU7c0JBRHJCLFlBQVk7dUJBQUMsMkJBQTJCO2dCQWVsQyxjQUFjO3NCQURwQixZQUFZO3VCQUFDLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBIb3N0TGlzdGVuZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtUb3VyU2VydmljZSwgVG91clN0YXRlfSBmcm9tICcuL3RvdXIuc2VydmljZSc7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICd0b3VyLWhvdGtleS1saXN0ZW5lcicsXG4gICAgdGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbiAgICBzdGFuZGFsb25lOiB0cnVlXG59KVxuZXhwb3J0IGNsYXNzIFRvdXJIb3RrZXlMaXN0ZW5lckNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHRvdXJTZXJ2aWNlOiBUb3VyU2VydmljZVxuICAgICkge31cblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyZXMgaG90IGtleXMgZm9yIGNvbnRyb2xsaW5nIHRoZSB0b3VyIHdpdGggdGhlIGtleWJvYXJkXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OmtleWRvd24uRXNjYXBlJylcbiAgICBwdWJsaWMgb25Fc2NhcGVLZXkoKTogdm9pZCB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMudG91clNlcnZpY2UuZ2V0U3RhdHVzKCkgPT09IFRvdXJTdGF0ZS5PTiAmJlxuICAgICAgICAgICAgdGhpcy50b3VyU2VydmljZS5pc0hvdGtleXNFbmFibGVkKClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnRvdXJTZXJ2aWNlLmVuZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OmtleWRvd24uQXJyb3dSaWdodCcpXG4gICAgcHVibGljIG9uQXJyb3dSaWdodEtleSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc3RlcCA9IHRoaXMudG91clNlcnZpY2UuY3VycmVudFN0ZXA7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy50b3VyU2VydmljZS5nZXRTdGF0dXMoKSA9PT0gVG91clN0YXRlLk9OICYmXG4gICAgICAgICAgICB0aGlzLnRvdXJTZXJ2aWNlLmhhc05leHQodGhpcy50b3VyU2VydmljZS5jdXJyZW50U3RlcCkgJiZcbiAgICAgICAgICAgIHRoaXMudG91clNlcnZpY2UuaXNIb3RrZXlzRW5hYmxlZCgpICYmXG4gICAgICAgICAgICAhc3RlcD8ubmV4dE9uQW5jaG9yQ2xpY2tcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnRvdXJTZXJ2aWNlLm5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzprZXlkb3duLkFycm93TGVmdCcpXG4gICAgcHVibGljIG9uQXJyb3dMZWZ0S2V5KCk6IHZvaWQge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnRvdXJTZXJ2aWNlLmdldFN0YXR1cygpID09PSBUb3VyU3RhdGUuT04gJiZcbiAgICAgICAgICAgIHRoaXMudG91clNlcnZpY2UuaGFzUHJldih0aGlzLnRvdXJTZXJ2aWNlLmN1cnJlbnRTdGVwKSAmJlxuICAgICAgICAgICAgdGhpcy50b3VyU2VydmljZS5pc0hvdGtleXNFbmFibGVkKClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnRvdXJTZXJ2aWNlLnByZXYoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==