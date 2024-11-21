import { Component, ViewChild, } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/menu";
export class TourAnchorOpenerComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourAnchorOpenerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.12", type: TourAnchorOpenerComponent, isStandalone: true, selector: "tour-anchor-opener", viewQueries: [{ propertyName: "trigger", first: true, predicate: MatMenuTrigger, descendants: true, static: true }], ngImport: i0, template: `
        <!--suppress HtmlUnknownAttribute -->
        <span matMenuTriggerFor [matMenuTriggerRestoreFocus]="false"></span>
    `, isInline: true, styles: [":host{display:none}\n"], dependencies: [{ kind: "ngmodule", type: MatMenuModule }, { kind: "directive", type: i1.MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourAnchorOpenerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tour-anchor-opener', template: `
        <!--suppress HtmlUnknownAttribute -->
        <span matMenuTriggerFor [matMenuTriggerRestoreFocus]="false"></span>
    `, standalone: true, imports: [
                        MatMenuModule
                    ], styles: [":host{display:none}\n"] }]
        }], propDecorators: { trigger: [{
                type: ViewChild,
                args: [MatMenuTrigger, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91ci1hbmNob3Itb3BlbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC11aS10b3VyLW1kLW1lbnUvc3JjL2xpYi90b3VyLWFuY2hvci1vcGVuZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxHQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBQyxhQUFhLEVBQUUsY0FBYyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7OztBQW9CckUsTUFBTSxPQUFPLHlCQUF5QjsrR0FBekIseUJBQXlCO21HQUF6Qix5QkFBeUIsdUhBRXZCLGNBQWMsOERBWGY7OztLQUdULDhGQUdHLGFBQWE7OzRGQUdSLHlCQUF5QjtrQkFsQnJDLFNBQVM7K0JBQ0ksb0JBQW9CLFlBUXBCOzs7S0FHVCxjQUNXLElBQUksV0FDUDt3QkFDTCxhQUFhO3FCQUNoQjs4QkFLTSxPQUFPO3NCQURiLFNBQVM7dUJBQUMsY0FBYyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBWaWV3Q2hpbGQsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0TWVudU1vZHVsZSwgTWF0TWVudVRyaWdnZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3RvdXItYW5jaG9yLW9wZW5lcicsXG4gICAgc3R5bGVzOiBbXG4gICAgICAgIGBcbiAgICAgICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgICAgfVxuICAgICAgICBgXG4gICAgXSxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8IS0tc3VwcHJlc3MgSHRtbFVua25vd25BdHRyaWJ1dGUgLS0+XG4gICAgICAgIDxzcGFuIG1hdE1lbnVUcmlnZ2VyRm9yIFttYXRNZW51VHJpZ2dlclJlc3RvcmVGb2N1c109XCJmYWxzZVwiPjwvc3Bhbj5cbiAgICBgLFxuICAgIHN0YW5kYWxvbmU6IHRydWUsXG4gICAgaW1wb3J0czogW1xuICAgICAgICBNYXRNZW51TW9kdWxlXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBUb3VyQW5jaG9yT3BlbmVyQ29tcG9uZW50IHtcblxuICAgIEBWaWV3Q2hpbGQoTWF0TWVudVRyaWdnZXIsIHtzdGF0aWM6IHRydWV9KVxuICAgIHB1YmxpYyB0cmlnZ2VyOiBNYXRNZW51VHJpZ2dlcjtcblxufVxuIl19