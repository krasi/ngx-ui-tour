import { Injectable } from '@angular/core';
import { TourService } from 'ngx-ui-tour-core';
import * as i0 from "@angular/core";
export class NgxmTourService extends TourService {
    initialize(steps, stepDefaults) {
        const userDefaults = this.getDefaults();
        stepDefaults ??= {};
        stepDefaults.showArrow ??= userDefaults?.showArrow ?? true;
        super.initialize(steps, stepDefaults);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: NgxmTourService, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: NgxmTourService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: NgxmTourService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW1kLW1lbnUtdG91ci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVpLXRvdXItbWQtbWVudS9zcmMvbGliL25neC1tZC1tZW51LXRvdXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQzs7QUFNN0MsTUFBTSxPQUFPLGVBQXlELFNBQVEsV0FBYztJQUV4RSxVQUFVLENBQUMsS0FBVSxFQUFFLFlBQWdCO1FBQ25ELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUV4QyxZQUFZLEtBQUssRUFBTyxDQUFDO1FBQ3pCLFlBQVksQ0FBQyxTQUFTLEtBQUssWUFBWSxFQUFFLFNBQVMsSUFBSSxJQUFJLENBQUM7UUFFM0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDMUMsQ0FBQzsrR0FUUSxlQUFlO21IQUFmLGVBQWUsY0FGWixNQUFNOzs0RkFFVCxlQUFlO2tCQUgzQixVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1RvdXJTZXJ2aWNlfSBmcm9tICduZ3gtdWktdG91ci1jb3JlJztcbmltcG9ydCB7SU1kU3RlcE9wdGlvbn0gZnJvbSAnLi9zdGVwLW9wdGlvbi5pbnRlcmZhY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5neG1Ub3VyU2VydmljZTxUIGV4dGVuZHMgSU1kU3RlcE9wdGlvbiA9IElNZFN0ZXBPcHRpb24+IGV4dGVuZHMgVG91clNlcnZpY2U8VD4ge1xuXG4gICAgcHVibGljIG92ZXJyaWRlIGluaXRpYWxpemUoc3RlcHM6IFRbXSwgc3RlcERlZmF1bHRzPzogVCkge1xuICAgICAgICBjb25zdCB1c2VyRGVmYXVsdHMgPSB0aGlzLmdldERlZmF1bHRzKCk7XG5cbiAgICAgICAgc3RlcERlZmF1bHRzID8/PSB7fSBhcyBUO1xuICAgICAgICBzdGVwRGVmYXVsdHMuc2hvd0Fycm93ID8/PSB1c2VyRGVmYXVsdHM/LnNob3dBcnJvdyA/PyB0cnVlO1xuXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoc3RlcHMsIHN0ZXBEZWZhdWx0cyk7XG4gICAgfVxuXG59XG4iXX0=