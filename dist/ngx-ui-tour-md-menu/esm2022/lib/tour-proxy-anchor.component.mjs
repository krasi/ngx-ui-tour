import { BaseTourProxyAnchor } from 'ngx-ui-tour-core';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { TourAnchorMatMenuDirective } from './tour-anchor.directive';
import * as i0 from "@angular/core";
import * as i1 from "./tour-anchor.directive";
export class TourProxyAnchorComponent extends BaseTourProxyAnchor {
    constructor() {
        super(...arguments);
        // noinspection JSUnusedGlobalSymbols
        this.anchorDirective = inject(TourAnchorMatMenuDirective, {
            host: true
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourProxyAnchorComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.12", type: TourProxyAnchorComponent, isStandalone: true, selector: "tour-proxy-anchor", inputs: { anchorEl: "anchorEl" }, usesInheritance: true, hostDirectives: [{ directive: i1.TourAnchorMatMenuDirective, inputs: ["tourAnchor", "anchorId"] }], ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourProxyAnchorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'tour-proxy-anchor',
                    template: ``,
                    standalone: true,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    imports: [
                        TourAnchorMatMenuDirective
                    ],
                    hostDirectives: [{
                            directive: TourAnchorMatMenuDirective,
                            inputs: ['tourAnchor: anchorId']
                        }]
                }]
        }], propDecorators: { anchorEl: [{
                type: Input,
                args: [{ required: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91ci1wcm94eS1hbmNob3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVpLXRvdXItbWQtbWVudS9zcmMvbGliL3RvdXItcHJveHktYW5jaG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEYsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0seUJBQXlCLENBQUM7OztBQWVuRSxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsbUJBQW1CO0lBYmpFOztRQWVJLHFDQUFxQztRQUNULG9CQUFlLEdBQUcsTUFBTSxDQUFDLDBCQUEwQixFQUFFO1lBQzdFLElBQUksRUFBRSxJQUFJO1NBQ2IsQ0FBQyxDQUFDO0tBS047K0dBVlksd0JBQXdCO21HQUF4Qix3QkFBd0IsME9BWHZCLEVBQUU7OzRGQVdILHdCQUF3QjtrQkFicEMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixRQUFRLEVBQUUsRUFBRTtvQkFDWixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLE9BQU8sRUFBRTt3QkFDTCwwQkFBMEI7cUJBQzdCO29CQUNELGNBQWMsRUFBRSxDQUFDOzRCQUNiLFNBQVMsRUFBRSwwQkFBMEI7NEJBQ3JDLE1BQU0sRUFBRSxDQUFDLHNCQUFzQixDQUFDO3lCQUNuQyxDQUFDO2lCQUNMOzhCQVNtQixRQUFRO3NCQUR2QixLQUFLO3VCQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QmFzZVRvdXJQcm94eUFuY2hvcn0gZnJvbSAnbmd4LXVpLXRvdXItY29yZSc7XG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBpbmplY3R9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtUb3VyQW5jaG9yTWF0TWVudURpcmVjdGl2ZX0gZnJvbSAnLi90b3VyLWFuY2hvci5kaXJlY3RpdmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3RvdXItcHJveHktYW5jaG9yJyxcbiAgICB0ZW1wbGF0ZTogYGAsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIFRvdXJBbmNob3JNYXRNZW51RGlyZWN0aXZlXG4gICAgXSxcbiAgICBob3N0RGlyZWN0aXZlczogW3tcbiAgICAgICAgZGlyZWN0aXZlOiBUb3VyQW5jaG9yTWF0TWVudURpcmVjdGl2ZSxcbiAgICAgICAgaW5wdXRzOiBbJ3RvdXJBbmNob3I6IGFuY2hvcklkJ11cbiAgICB9XVxufSlcbmV4cG9ydCBjbGFzcyBUb3VyUHJveHlBbmNob3JDb21wb25lbnQgZXh0ZW5kcyBCYXNlVG91clByb3h5QW5jaG9yIHtcblxuICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVhZG9ubHkgYW5jaG9yRGlyZWN0aXZlID0gaW5qZWN0KFRvdXJBbmNob3JNYXRNZW51RGlyZWN0aXZlLCB7XG4gICAgICAgIGhvc3Q6IHRydWVcbiAgICB9KTtcblxuICAgIEBJbnB1dCh7cmVxdWlyZWQ6IHRydWV9KVxuICAgIHB1YmxpYyBvdmVycmlkZSBhbmNob3JFbDogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG5cbn1cbiJdfQ==