import type { OnDestroy, OnInit } from '@angular/core';
import { ElementRef, ViewContainerRef } from '@angular/core';
import { TourAnchorDirective } from 'ngx-ui-tour-core';
import { Subscription } from 'rxjs';
import { TourAnchorOpenerComponent } from './tour-anchor-opener.component';
import { TourStepTemplateService } from './tour-step-template.service';
import { NgxmTourService } from './ngx-md-menu-tour.service';
import { IMdStepOption } from './step-option.interface';
import * as i0 from "@angular/core";
export declare class TourAnchorMatMenuDirective implements OnInit, OnDestroy, TourAnchorDirective {
    private viewContainer;
    element: ElementRef;
    private tourService;
    private tourStepTemplate;
    tourAnchor: string;
    opener: TourAnchorOpenerComponent;
    menuCloseSubscription: Subscription;
    isActive: boolean;
    constructor(viewContainer: ViewContainerRef, element: ElementRef, tourService: NgxmTourService, tourStepTemplate: TourStepTemplateService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private createOpener;
    showTourStep(step: IMdStepOption): void;
    private setPosition;
    hideTourStep(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TourAnchorMatMenuDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TourAnchorMatMenuDirective, "[tourAnchor]", never, { "tourAnchor": { "alias": "tourAnchor"; "required": false; }; }, {}, never, never, true, never>;
}
