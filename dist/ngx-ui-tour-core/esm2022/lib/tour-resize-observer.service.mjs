import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { debounceTime, fromEvent, merge, Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class TourResizeObserverService {
    constructor() {
        this.resizeElSubject = new Subject();
        this.platformId = inject(PLATFORM_ID);
        this.isResizeObserverSupported = isPlatformBrowser(this.platformId) && !!ResizeObserver;
        this.document = inject(DOCUMENT);
        this.window = this.document.defaultView;
        this.resize$ = merge(this.resizeElSubject, fromEvent(this.window, 'resize')).pipe(debounceTime(10));
    }
    observeElement(target) {
        if (this.isResizeObserverSupported && !this.resizeObserver) {
            this.resizeObserver = new ResizeObserver(() => this.resizeElSubject.next());
        }
        this.resizeObserver?.observe(target);
    }
    unobserveElement(target) {
        this.resizeObserver?.unobserve(target);
    }
    disconnect() {
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourResizeObserverService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourResizeObserverService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourResizeObserverService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91ci1yZXNpemUtb2JzZXJ2ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC11aS10b3VyLWNvcmUvc3JjL2xpYi90b3VyLXJlc2l6ZS1vYnNlcnZlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFLN0QsTUFBTSxPQUFPLHlCQUF5QjtJQUh0QztRQUtxQixvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDdEMsZUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqQyw4QkFBeUIsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQztRQUVuRixhQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLFdBQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUVwQyxZQUFPLEdBQUcsS0FBSyxDQUMzQixJQUFJLENBQUMsZUFBZSxFQUNwQixTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FDbkMsQ0FBQyxJQUFJLENBQ0YsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUNuQixDQUFDO0tBcUJMO0lBbkJHLGNBQWMsQ0FBQyxNQUFlO1FBQzFCLElBQUksSUFBSSxDQUFDLHlCQUF5QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3pELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQ3BDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQ3BDLENBQUM7UUFDTixDQUFDO1FBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELGdCQUFnQixDQUFDLE1BQWU7UUFDNUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFJLENBQUMsY0FBYyxFQUFFLFVBQVUsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO0lBQ3BDLENBQUM7K0dBakNRLHlCQUF5QjttSEFBekIseUJBQXlCLGNBRnRCLE1BQU07OzRGQUVULHlCQUF5QjtrQkFIckMsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7aW5qZWN0LCBJbmplY3RhYmxlLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2RlYm91bmNlVGltZSwgZnJvbUV2ZW50LCBtZXJnZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgVG91clJlc2l6ZU9ic2VydmVyU2VydmljZSB7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlc2l6ZUVsU3ViamVjdCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBwbGF0Zm9ybUlkID0gaW5qZWN0KFBMQVRGT1JNX0lEKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGlzUmVzaXplT2JzZXJ2ZXJTdXBwb3J0ZWQgPSBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpICYmICEhUmVzaXplT2JzZXJ2ZXI7XG4gICAgcHJpdmF0ZSByZXNpemVPYnNlcnZlcj86IFJlc2l6ZU9ic2VydmVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgd2luZG93ID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldztcblxuICAgIHB1YmxpYyByZWFkb25seSByZXNpemUkID0gbWVyZ2UoXG4gICAgICAgIHRoaXMucmVzaXplRWxTdWJqZWN0LFxuICAgICAgICBmcm9tRXZlbnQodGhpcy53aW5kb3csICdyZXNpemUnKVxuICAgICkucGlwZShcbiAgICAgICAgZGVib3VuY2VUaW1lKDEwKVxuICAgICk7XG5cbiAgICBvYnNlcnZlRWxlbWVudCh0YXJnZXQ6IEVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSZXNpemVPYnNlcnZlclN1cHBvcnRlZCAmJiAhdGhpcy5yZXNpemVPYnNlcnZlcikge1xuICAgICAgICAgICAgdGhpcy5yZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcihcbiAgICAgICAgICAgICAgICAoKSA9PiB0aGlzLnJlc2l6ZUVsU3ViamVjdC5uZXh0KClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc2l6ZU9ic2VydmVyPy5vYnNlcnZlKHRhcmdldCk7XG4gICAgfVxuXG4gICAgdW5vYnNlcnZlRWxlbWVudCh0YXJnZXQ6IEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5yZXNpemVPYnNlcnZlcj8udW5vYnNlcnZlKHRhcmdldCk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdCgpIHtcbiAgICAgICAgdGhpcy5yZXNpemVPYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xuICAgICAgICB0aGlzLnJlc2l6ZU9ic2VydmVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxufVxuIl19