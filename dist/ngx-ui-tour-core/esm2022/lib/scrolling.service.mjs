import { isCovered, isInViewport, OverflowUtils, ScrollUtils } from './utils';
import { debounceTime, firstValueFrom, fromEvent, map, of, timeout } from 'rxjs';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import * as i0 from "@angular/core";
export class ScrollingService {
    constructor() {
        this.platformId = inject(PLATFORM_ID);
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.document = inject(DOCUMENT);
        this.window = this.document.defaultView;
    }
    ensureVisible(anchorElement, options) {
        this.scrollOptions = options;
        this.anchorEl = anchorElement;
        const behavior = options.smoothScroll && this.isBrowser ? 'smooth' : 'auto';
        const userScrollContainer = this.scrollOptions.scrollContainer, scrollContainer = ScrollUtils.getScrollContainer(anchorElement, userScrollContainer) ?? document.documentElement;
        if (OverflowUtils.isHeightOverflowing(anchorElement, scrollContainer)) {
            anchorElement.scrollIntoView({
                block: 'start',
                inline: 'start',
                behavior
            });
        }
        else if (options.center && !('safari' in this.window)) {
            anchorElement.scrollIntoView({
                block: 'center',
                inline: 'center',
                behavior
            });
        }
        else if (!isInViewport(anchorElement, 1 /* ElementSides.Bottom */) || isCovered(anchorElement, 1 /* ElementSides.Bottom */)) {
            anchorElement.scrollIntoView({
                block: 'end',
                inline: 'nearest',
                behavior
            });
        }
        else if (!isInViewport(anchorElement, 0 /* ElementSides.Top */) || isCovered(anchorElement, 0 /* ElementSides.Top */)) {
            anchorElement.scrollIntoView({
                block: 'start',
                inline: 'nearest',
                behavior
            });
        }
        else {
            return Promise.resolve();
        }
        return behavior === 'smooth' ? firstValueFrom(this.waitForScrollFinish$) : Promise.resolve();
    }
    get waitForScrollFinish$() {
        const userScrollContainer = this.scrollOptions.scrollContainer, 
        // Default here is "document" instead of "document.documentElement" on purpose
        scrollContainer = ScrollUtils.getScrollContainer(this.anchorEl, userScrollContainer) ?? document;
        return fromEvent(scrollContainer, 'scroll')
            .pipe(timeout({
            each: 75,
            with: () => of(undefined)
        }), debounceTime(50), map(() => undefined));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: ScrollingService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: ScrollingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: ScrollingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsaW5nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtdWktdG91ci1jb3JlL3NyYy9saWIvc2Nyb2xsaW5nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFlLFNBQVMsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUMxRixPQUFPLEVBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDL0UsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7QUFXNUQsTUFBTSxPQUFPLGdCQUFnQjtJQUg3QjtRQUtxQixlQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pDLGNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0MsYUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QixXQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7S0E0RHZEO0lBeERHLGFBQWEsQ0FBQyxhQUEwQixFQUFFLE9BQXNCO1FBQzVELElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDO1FBRTlCLE1BQU0sUUFBUSxHQUFtQixPQUFPLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRTVGLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQzFELGVBQWUsR0FBRyxXQUFXLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLG1CQUFtQixDQUFDLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQztRQUVySCxJQUFJLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLEVBQUUsQ0FBQztZQUNwRSxhQUFhLENBQUMsY0FBYyxDQUFDO2dCQUN6QixLQUFLLEVBQUUsT0FBTztnQkFDZCxNQUFNLEVBQUUsT0FBTztnQkFDZixRQUFRO2FBQ1gsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ3RELGFBQWEsQ0FBQyxjQUFjLENBQUM7Z0JBQ3pCLEtBQUssRUFBRSxRQUFRO2dCQUNmLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixRQUFRO2FBQ1gsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSw4QkFBc0IsSUFBSSxTQUFTLENBQUMsYUFBYSw4QkFBc0IsRUFBRSxDQUFDO1lBQzVHLGFBQWEsQ0FBQyxjQUFjLENBQUM7Z0JBQ3pCLEtBQUssRUFBRSxLQUFLO2dCQUNaLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixRQUFRO2FBQ1gsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSwyQkFBbUIsSUFBSSxTQUFTLENBQUMsYUFBYSwyQkFBbUIsRUFBRSxDQUFDO1lBQ3RHLGFBQWEsQ0FBQyxjQUFjLENBQUM7Z0JBQ3pCLEtBQUssRUFBRSxPQUFPO2dCQUNkLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixRQUFRO2FBQ1gsQ0FBQyxDQUFDO1FBQ1AsQ0FBQzthQUFNLENBQUM7WUFDSixPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM3QixDQUFDO1FBRUQsT0FBTyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqRyxDQUFDO0lBRUQsSUFBWSxvQkFBb0I7UUFDNUIsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWU7UUFDMUQsOEVBQThFO1FBQzlFLGVBQWUsR0FBRyxXQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxJQUFJLFFBQVEsQ0FBQztRQUVyRyxPQUFPLFNBQVMsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDO2FBQ3RDLElBQUksQ0FDRCxPQUFPLENBQUM7WUFDSixJQUFJLEVBQUUsRUFBRTtZQUNSLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDO1NBQzVCLENBQUMsRUFDRixZQUFZLENBQUMsRUFBRSxDQUFDLEVBQ2hCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FDdkIsQ0FBQztJQUNWLENBQUM7K0dBL0RRLGdCQUFnQjttSEFBaEIsZ0JBQWdCLGNBRmIsTUFBTTs7NEZBRVQsZ0JBQWdCO2tCQUg1QixVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RWxlbWVudFNpZGVzLCBpc0NvdmVyZWQsIGlzSW5WaWV3cG9ydCwgT3ZlcmZsb3dVdGlscywgU2Nyb2xsVXRpbHN9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtkZWJvdW5jZVRpbWUsIGZpcnN0VmFsdWVGcm9tLCBmcm9tRXZlbnQsIG1hcCwgb2YsIHRpbWVvdXR9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtpbmplY3QsIEluamVjdGFibGUsIFBMQVRGT1JNX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNjcm9sbE9wdGlvbnMge1xuICAgIGNlbnRlcjogYm9vbGVhbjtcbiAgICBzbW9vdGhTY3JvbGw6IGJvb2xlYW47XG4gICAgc2Nyb2xsQ29udGFpbmVyPzogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgU2Nyb2xsaW5nU2VydmljZSB7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHBsYXRmb3JtSWQgPSBpbmplY3QoUExBVEZPUk1fSUQpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaXNCcm93c2VyID0gaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHdpbmRvdyA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gICAgcHJpdmF0ZSBzY3JvbGxPcHRpb25zOiBTY3JvbGxPcHRpb25zO1xuICAgIHByaXZhdGUgYW5jaG9yRWw6IEhUTUxFbGVtZW50O1xuXG4gICAgZW5zdXJlVmlzaWJsZShhbmNob3JFbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9uczogU2Nyb2xsT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnNjcm9sbE9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmFuY2hvckVsID0gYW5jaG9yRWxlbWVudDtcblxuICAgICAgICBjb25zdCBiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSBvcHRpb25zLnNtb290aFNjcm9sbCAmJiB0aGlzLmlzQnJvd3NlciA/ICdzbW9vdGgnIDogJ2F1dG8nO1xuXG4gICAgICAgIGNvbnN0IHVzZXJTY3JvbGxDb250YWluZXIgPSB0aGlzLnNjcm9sbE9wdGlvbnMuc2Nyb2xsQ29udGFpbmVyLFxuICAgICAgICAgICAgc2Nyb2xsQ29udGFpbmVyID0gU2Nyb2xsVXRpbHMuZ2V0U2Nyb2xsQ29udGFpbmVyKGFuY2hvckVsZW1lbnQsIHVzZXJTY3JvbGxDb250YWluZXIpID8/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgICBpZiAoT3ZlcmZsb3dVdGlscy5pc0hlaWdodE92ZXJmbG93aW5nKGFuY2hvckVsZW1lbnQsIHNjcm9sbENvbnRhaW5lcikpIHtcbiAgICAgICAgICAgIGFuY2hvckVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgICAgIGJsb2NrOiAnc3RhcnQnLFxuICAgICAgICAgICAgICAgIGlubGluZTogJ3N0YXJ0JyxcbiAgICAgICAgICAgICAgICBiZWhhdmlvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5jZW50ZXIgJiYgISgnc2FmYXJpJyBpbiB0aGlzLndpbmRvdykpIHtcbiAgICAgICAgICAgIGFuY2hvckVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgICAgIGJsb2NrOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICBpbmxpbmU6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIGJlaGF2aW9yXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICghaXNJblZpZXdwb3J0KGFuY2hvckVsZW1lbnQsIEVsZW1lbnRTaWRlcy5Cb3R0b20pIHx8IGlzQ292ZXJlZChhbmNob3JFbGVtZW50LCBFbGVtZW50U2lkZXMuQm90dG9tKSkge1xuICAgICAgICAgICAgYW5jaG9yRWxlbWVudC5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgICAgICAgICAgYmxvY2s6ICdlbmQnLFxuICAgICAgICAgICAgICAgIGlubGluZTogJ25lYXJlc3QnLFxuICAgICAgICAgICAgICAgIGJlaGF2aW9yXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICghaXNJblZpZXdwb3J0KGFuY2hvckVsZW1lbnQsIEVsZW1lbnRTaWRlcy5Ub3ApIHx8IGlzQ292ZXJlZChhbmNob3JFbGVtZW50LCBFbGVtZW50U2lkZXMuVG9wKSkge1xuICAgICAgICAgICAgYW5jaG9yRWxlbWVudC5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgICAgICAgICAgYmxvY2s6ICdzdGFydCcsXG4gICAgICAgICAgICAgICAgaW5saW5lOiAnbmVhcmVzdCcsXG4gICAgICAgICAgICAgICAgYmVoYXZpb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJlaGF2aW9yID09PSAnc21vb3RoJyA/IGZpcnN0VmFsdWVGcm9tKHRoaXMud2FpdEZvclNjcm9sbEZpbmlzaCQpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgd2FpdEZvclNjcm9sbEZpbmlzaCQoKSB7XG4gICAgICAgIGNvbnN0IHVzZXJTY3JvbGxDb250YWluZXIgPSB0aGlzLnNjcm9sbE9wdGlvbnMuc2Nyb2xsQ29udGFpbmVyLFxuICAgICAgICAgICAgLy8gRGVmYXVsdCBoZXJlIGlzIFwiZG9jdW1lbnRcIiBpbnN0ZWFkIG9mIFwiZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XCIgb24gcHVycG9zZVxuICAgICAgICAgICAgc2Nyb2xsQ29udGFpbmVyID0gU2Nyb2xsVXRpbHMuZ2V0U2Nyb2xsQ29udGFpbmVyKHRoaXMuYW5jaG9yRWwsIHVzZXJTY3JvbGxDb250YWluZXIpID8/IGRvY3VtZW50O1xuXG4gICAgICAgIHJldHVybiBmcm9tRXZlbnQoc2Nyb2xsQ29udGFpbmVyLCAnc2Nyb2xsJylcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIHRpbWVvdXQoe1xuICAgICAgICAgICAgICAgICAgICBlYWNoOiA3NSxcbiAgICAgICAgICAgICAgICAgICAgd2l0aDogKCkgPT4gb2YodW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGRlYm91bmNlVGltZSg1MCksXG4gICAgICAgICAgICAgICAgbWFwKCgpID0+IHVuZGVmaW5lZClcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG59XG4iXX0=