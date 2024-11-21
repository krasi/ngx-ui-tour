import { inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollUtils } from './utils';
import * as i0 from "@angular/core";
export class ScrollBlockingService {
    constructor() {
        this.isEnabled = false;
        this.platformId = inject(PLATFORM_ID);
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.rendererFactory = inject(RendererFactory2);
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }
    enable(scrollContainer) {
        if (!this.isBrowser || this.isEnabled) {
            return;
        }
        this.userScrollContainer = scrollContainer;
        this.toggleOverflow();
        this.isEnabled = true;
    }
    disable() {
        if (!this.isEnabled) {
            return;
        }
        this.toggleOverflow();
        this.isEnabled = false;
    }
    toggleOverflow() {
        // Don't try to automatically detect scroll container here since that breaks smooth scrolling
        const scrollContainer = ScrollUtils.getScrollContainer(null, this.userScrollContainer) ?? document.documentElement;
        if (this.isEnabled) {
            this.renderer.removeStyle(scrollContainer, 'overflow');
        }
        else {
            this.renderer.setStyle(scrollContainer, 'overflow', 'hidden');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: ScrollBlockingService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: ScrollBlockingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: ScrollBlockingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLWJsb2NraW5nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtdWktdG91ci1jb3JlL3NyYy9saWIvc2Nyb2xsLWJsb2NraW5nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hGLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxTQUFTLENBQUM7O0FBS3BDLE1BQU0sT0FBTyxxQkFBcUI7SUFIbEM7UUFLWSxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBR1QsZUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqQyxjQUFTLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLG9CQUFlLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDM0MsYUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQWdDL0U7SUE5QkcsTUFBTSxDQUFDLGVBQXFDO1FBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNwQyxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxlQUFlLENBQUM7UUFDM0MsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRCxPQUFPO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNsQixPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRU8sY0FBYztRQUNsQiw2RkFBNkY7UUFDN0YsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDO1FBRW5ILElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMzRCxDQUFDO2FBQU0sQ0FBQztZQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEUsQ0FBQztJQUNMLENBQUM7K0dBdENRLHFCQUFxQjttSEFBckIscUJBQXFCLGNBRmxCLE1BQU07OzRGQUVULHFCQUFxQjtrQkFIakMsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2luamVjdCwgSW5qZWN0YWJsZSwgUExBVEZPUk1fSUQsIFJlbmRlcmVyRmFjdG9yeTJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7U2Nyb2xsVXRpbHN9IGZyb20gJy4vdXRpbHMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbEJsb2NraW5nU2VydmljZSB7XG5cbiAgICBwcml2YXRlIGlzRW5hYmxlZCA9IGZhbHNlO1xuICAgIHByaXZhdGUgdXNlclNjcm9sbENvbnRhaW5lcjogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHBsYXRmb3JtSWQgPSBpbmplY3QoUExBVEZPUk1fSUQpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaXNCcm93c2VyID0gaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyRmFjdG9yeSA9IGluamVjdChSZW5kZXJlckZhY3RvcnkyKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyID0gdGhpcy5yZW5kZXJlckZhY3RvcnkuY3JlYXRlUmVuZGVyZXIobnVsbCwgbnVsbCk7XG5cbiAgICBlbmFibGUoc2Nyb2xsQ29udGFpbmVyOiBzdHJpbmcgfCBIVE1MRWxlbWVudCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNCcm93c2VyIHx8IHRoaXMuaXNFbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZXJTY3JvbGxDb250YWluZXIgPSBzY3JvbGxDb250YWluZXI7XG4gICAgICAgIHRoaXMudG9nZ2xlT3ZlcmZsb3coKTtcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0VuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9nZ2xlT3ZlcmZsb3coKTtcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvZ2dsZU92ZXJmbG93KCkge1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gYXV0b21hdGljYWxseSBkZXRlY3Qgc2Nyb2xsIGNvbnRhaW5lciBoZXJlIHNpbmNlIHRoYXQgYnJlYWtzIHNtb290aCBzY3JvbGxpbmdcbiAgICAgICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVyID0gU2Nyb2xsVXRpbHMuZ2V0U2Nyb2xsQ29udGFpbmVyKG51bGwsIHRoaXMudXNlclNjcm9sbENvbnRhaW5lcikgPz8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVTdHlsZShzY3JvbGxDb250YWluZXIsICdvdmVyZmxvdycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShzY3JvbGxDb250YWluZXIsICdvdmVyZmxvdycsICdoaWRkZW4nKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIl19