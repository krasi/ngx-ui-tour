import { inject, Injectable, RendererFactory2 } from '@angular/core';
import * as i0 from "@angular/core";
export class AnchorClickService {
    constructor() {
        this.rendererFactory = inject(RendererFactory2);
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }
    removeListener() {
        if (this.unListenToAnchorClickFn) {
            this.unListenToAnchorClickFn();
            this.unListenToAnchorClickFn = undefined;
        }
    }
    addListener(anchorEl, callback) {
        this.unListenToAnchorClickFn = this.renderer.listen(anchorEl, 'click', callback);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: AnchorClickService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: AnchorClickService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: AnchorClickService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5jaG9yLWNsaWNrLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtdWktdG91ci1jb3JlL3NyYy9saWIvYW5jaG9yLWNsaWNrLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBS25FLE1BQU0sT0FBTyxrQkFBa0I7SUFIL0I7UUFLcUIsb0JBQWUsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMzQyxhQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBYy9FO0lBVlUsY0FBYztRQUNqQixJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxTQUFTLENBQUM7UUFDN0MsQ0FBQztJQUNMLENBQUM7SUFFTSxXQUFXLENBQUMsUUFBcUIsRUFBRSxRQUFvQjtRQUMxRCxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRixDQUFDOytHQWhCUSxrQkFBa0I7bUhBQWxCLGtCQUFrQixjQUZmLE1BQU07OzRGQUVULGtCQUFrQjtrQkFIOUIsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2luamVjdCwgSW5qZWN0YWJsZSwgUmVuZGVyZXJGYWN0b3J5Mn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQW5jaG9yQ2xpY2tTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXJGYWN0b3J5ID0gaW5qZWN0KFJlbmRlcmVyRmFjdG9yeTIpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVyRmFjdG9yeS5jcmVhdGVSZW5kZXJlcihudWxsLCBudWxsKTtcblxuICAgIHByaXZhdGUgdW5MaXN0ZW5Ub0FuY2hvckNsaWNrRm46ICgpID0+IHZvaWQ7XG5cbiAgICBwdWJsaWMgcmVtb3ZlTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnVuTGlzdGVuVG9BbmNob3JDbGlja0ZuKSB7XG4gICAgICAgICAgICB0aGlzLnVuTGlzdGVuVG9BbmNob3JDbGlja0ZuKCk7XG4gICAgICAgICAgICB0aGlzLnVuTGlzdGVuVG9BbmNob3JDbGlja0ZuID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFkZExpc3RlbmVyKGFuY2hvckVsOiBIVE1MRWxlbWVudCwgY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy51bkxpc3RlblRvQW5jaG9yQ2xpY2tGbiA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGFuY2hvckVsLCAnY2xpY2snLCBjYWxsYmFjayk7XG4gICAgfVxufSJdfQ==