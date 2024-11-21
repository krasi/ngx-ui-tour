import { TourService } from 'ngx-ui-tour-core';
import { IMdStepOption } from './step-option.interface';
import * as i0 from "@angular/core";
export declare class NgxmTourService<T extends IMdStepOption = IMdStepOption> extends TourService<T> {
    initialize(steps: T[], stepDefaults?: T): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxmTourService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxmTourService<any>>;
}
