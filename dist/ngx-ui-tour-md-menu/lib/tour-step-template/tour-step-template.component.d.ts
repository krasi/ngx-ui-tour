import { AfterViewInit, TemplateRef } from '@angular/core';
import { TourHotkeyListenerComponent } from 'ngx-ui-tour-core';
import { MatMenu } from '@angular/material/menu';
import { IMdStepOption } from '../step-option.interface';
import { TourStepTemplateService } from '../tour-step-template.service';
import { NgxmTourService } from '../ngx-md-menu-tour.service';
import * as i0 from "@angular/core";
export declare class TourStepTemplateComponent extends TourHotkeyListenerComponent implements AfterViewInit {
    private tourStepTemplateService;
    tourService: NgxmTourService;
    tourStep: MatMenu;
    stepTemplate: TemplateRef<{
        step: IMdStepOption;
    }>;
    stepTemplateContent: TemplateRef<{
        step: IMdStepOption;
    }>;
    step: IMdStepOption;
    constructor(tourStepTemplateService: TourStepTemplateService, tourService: NgxmTourService);
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TourStepTemplateComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TourStepTemplateComponent, "tour-step-template", never, { "stepTemplate": { "alias": "stepTemplate"; "required": false; }; }, {}, ["stepTemplateContent"], never, true, never>;
}
