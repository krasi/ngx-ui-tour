import * as i0 from '@angular/core';
import { Component, ViewChild, Injectable, Directive, Input, HostBinding, TemplateRef, ContentChild, inject, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { TourService, TourState, TourHotkeyListenerComponent, BaseTourProxyAnchor } from 'ngx-ui-tour-core';
import { first } from 'rxjs';
import * as i1 from '@angular/material/menu';
import { MatMenuTrigger, MatMenuModule, MatMenu } from '@angular/material/menu';
import * as i3 from '@angular/material/card';
import { MatCardModule } from '@angular/material/card';
import { NgTemplateOutlet } from '@angular/common';
import * as i5 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import * as i6 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';

class TourAnchorOpenerComponent {
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

class NgxmTourService extends TourService {
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

class TourStepTemplateService {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourStepTemplateService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourStepTemplateService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourStepTemplateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class TourAnchorMatMenuDirective {
    constructor(viewContainer, element, tourService, tourStepTemplate) {
        this.viewContainer = viewContainer;
        this.element = element;
        this.tourService = tourService;
        this.tourStepTemplate = tourStepTemplate;
    }
    ngOnInit() {
        this.tourService.register(this.tourAnchor, this);
    }
    ngOnDestroy() {
        this.tourService.unregister(this.tourAnchor);
    }
    createOpener() {
        this.opener = this.viewContainer.createComponent(TourAnchorOpenerComponent).instance;
    }
    // noinspection JSUnusedGlobalSymbols
    showTourStep(step) {
        this.isActive = true;
        this.tourStepTemplate.templateComponent.step = step;
        if (!this.opener) {
            this.createOpener();
        }
        const trigger = this.opener.trigger, customTrigger = trigger;
        customTrigger._element = this.element;
        // Fixes tour step closing when hovering over mat-menu item, issue #123
        customTrigger._parentMaterialMenu = null;
        // Overrides position setting to support opening to the sides
        customTrigger._setPosition = (menu, positionStrategy) => this.setPosition(menu, positionStrategy, step);
        const menu = this.tourStepTemplate.templateComponent.tourStep;
        trigger.menu = menu;
        menu.xPosition = step.placement?.xPosition || 'after';
        menu.yPosition = step.placement?.yPosition || 'below';
        menu.hasBackdrop = !!step.closeOnOutsideClick;
        const popoverClass = step.popoverClass ?? '', arrow = step.showArrow ? 'arrow' : '', horizontal = step.placement?.horizontal ? 'horizontal' : '';
        menu.panelClass = `tour-step ${popoverClass} ${arrow} ${horizontal}`;
        trigger.openMenu();
        if (this.menuCloseSubscription) {
            this.menuCloseSubscription.unsubscribe();
        }
        this.menuCloseSubscription = trigger.menuClosed
            .pipe(first())
            .subscribe(() => {
            if (this.tourService.getStatus() !== TourState.OFF) {
                this.tourService.end();
            }
        });
    }
    setPosition(menu, positionStrategy, step) {
        let [originX, originFallbackX] = menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'];
        const [overlayY, overlayFallbackY] = menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];
        let [originY, originFallbackY] = [overlayY, overlayFallbackY];
        let [overlayX, overlayFallbackX] = [originX, originFallbackX];
        const isHorizontal = step.placement?.horizontal;
        if (isHorizontal) {
            overlayFallbackX = originX = menu.xPosition === 'before' ? 'start' : 'end';
            originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
        }
        else if (!menu.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }
        const offset = step.backdropConfig?.offset ?? 0, offsetX = isHorizontal ? offset : -offset, offsetY = isHorizontal ? -offset : offset;
        const original = { originX, originY, overlayX, overlayY, offsetX, offsetY };
        const flipX = {
            originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY,
            offsetX: -offsetX, offsetY
        };
        const flipY = {
            originX, originY: originFallbackY, overlayX, overlayY: overlayFallbackY, offsetX, offsetY: -offsetY
        };
        const flipXY = {
            originX: originFallbackX, originY: originFallbackY, overlayX: overlayFallbackX, overlayY: overlayFallbackY,
            offsetX: -offsetX, offsetY: -offsetY
        };
        positionStrategy.withPositions(isHorizontal ? [original, flipX] : [original, flipY, flipXY]);
    }
    // noinspection JSUnusedGlobalSymbols
    hideTourStep() {
        this.isActive = false;
        if (this.menuCloseSubscription) {
            this.menuCloseSubscription.unsubscribe();
        }
        this.opener.trigger.closeMenu();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourAnchorMatMenuDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: NgxmTourService }, { token: TourStepTemplateService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.12", type: TourAnchorMatMenuDirective, isStandalone: true, selector: "[tourAnchor]", inputs: { tourAnchor: "tourAnchor" }, host: { properties: { "class.touranchor--is-active": "this.isActive" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourAnchorMatMenuDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[tourAnchor]',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: NgxmTourService }, { type: TourStepTemplateService }], propDecorators: { tourAnchor: [{
                type: Input
            }], isActive: [{
                type: HostBinding,
                args: ['class.touranchor--is-active']
            }] } });

class TourStepTemplateComponent extends TourHotkeyListenerComponent {
    constructor(tourStepTemplateService, tourService) {
        super(tourService);
        this.tourStepTemplateService = tourStepTemplateService;
        this.tourService = tourService;
        this.step = {};
    }
    ngAfterViewInit() {
        this.tourStepTemplateService.templateComponent = this;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourStepTemplateComponent, deps: [{ token: TourStepTemplateService }, { token: NgxmTourService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.12", type: TourStepTemplateComponent, isStandalone: true, selector: "tour-step-template", inputs: { stepTemplate: "stepTemplate" }, queries: [{ propertyName: "stepTemplateContent", first: true, predicate: TemplateRef, descendants: true }], viewQueries: [{ propertyName: "tourStep", first: true, predicate: MatMenu, descendants: true }], usesInheritance: true, ngImport: i0, template: "<mat-menu [overlapTrigger]=\"false\">\n    <ng-container\n        *ngTemplateOutlet=\"\n            stepTemplate || stepTemplateContent || defaultTemplate;\n            context: { step: step }\n        \"\n    ></ng-container>\n</mat-menu>\n\n<ng-template #defaultTemplate let-step=\"step\">\n    <mat-card\n        (click)=\"$event.stopPropagation()\"\n        [style.width]=\"step.stepDimensions?.width\"\n        [style.min-width]=\"step.stepDimensions?.minWidth\"\n        [style.max-width]=\"step.stepDimensions?.maxWidth\"\n    >\n        <mat-card-header>\n            <div class=\"header-group\">\n                <mat-card-title>\n                    {{ step.title }}\n                </mat-card-title>\n                <button\n                    mat-icon-button\n                    (click)=\"tourService.end()\"\n                    class=\"close\"\n                >\n                    <mat-icon>close</mat-icon>\n                </button>\n            </div>\n        </mat-card-header>\n\n        <mat-card-content\n            class=\"mat-body\"\n            [innerHTML]=\"step.content\"\n        ></mat-card-content>\n\n        <mat-card-actions\n            [class.no-progress]=\"!step.showProgress\"\n        >\n            <button\n                mat-button\n                class=\"prev\"\n                [disabled]=\"!tourService.hasPrev(step)\"\n                (click)=\"tourService.prev()\"\n            >\n                <mat-icon>chevron_left</mat-icon>\n                {{ step.prevBtnTitle }}\n            </button>\n            @if (step.showProgress) {\n                <div class=\"progress\">{{ tourService.steps?.indexOf(step) + 1 }} / {{ tourService.steps?.length }}</div>\n            }\n            @if (tourService.hasNext(step) && !step.nextOnAnchorClick) {\n                <button\n                    class=\"next\"\n                    (click)=\"tourService.next()\"\n                    mat-button\n                >\n                    {{ step.nextBtnTitle }}\n                    <mat-icon iconPositionEnd>chevron_right</mat-icon>\n                </button>\n            }\n            @if (!tourService.hasNext(step)) {\n                <button\n                    mat-button\n                    (click)=\"tourService.end()\"\n                >\n                    {{ step.endBtnTitle }}\n                </button>\n            }\n        </mat-card-actions>\n    </mat-card>\n</ng-template>\n", styles: ["html{--mat-icon-button-touch-target-display: none}.mat-mdc-icon-button.mat-mdc-button-base{--mdc-icon-button-state-layer-size: 36px;width:var(--mdc-icon-button-state-layer-size);height:var(--mdc-icon-button-state-layer-size);padding:6px}::ng-deep .tour-step .mat-mdc-menu-content{padding:0!important}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step{min-width:unset;max-width:unset;overflow:unset;box-shadow:none;filter:drop-shadow(0px 5px 5px rgba(0,0,0,.2)) drop-shadow(0px 8px 10px rgba(0,0,0,.14))}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow{position:relative}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow:after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow:before{bottom:100%;border:solid transparent;content:\" \";height:0;width:0;position:absolute;pointer-events:none}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow:after{border-color:#fff0;border-width:8px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow:before{border-color:#e3e4e600;border-width:9px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before:not(.horizontal):after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before:not(.horizontal):before{right:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before:not(.horizontal):after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before:not(.horizontal):before{right:20px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before:not(.horizontal):before{margin-right:-1px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after:not(.horizontal):after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after:not(.horizontal):before{left:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after:not(.horizontal):after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after:not(.horizontal):before{left:20px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after:not(.horizontal):after{margin-left:1px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below:not(.horizontal){margin-top:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below:not(.horizontal):after{border-top-color:transparent;border-bottom-color:#fff}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below:not(.horizontal):before{border-top-color:transparent;border-bottom-color:#e3e4e6}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above:not(.horizontal){margin-bottom:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above:not(.horizontal):after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above:not(.horizontal):before{top:100%}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above:not(.horizontal):after{border-top-color:#fff;border-bottom-color:transparent}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above:not(.horizontal):before{border-top-color:#e3e4e6;border-bottom-color:transparent}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before.horizontal{margin-right:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before.horizontal:after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before.horizontal:before{left:100%}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before.horizontal:after{border-left-color:#fff;border-right-color:transparent}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before.horizontal:before{border-left-color:#e3e4e6;border-right-color:transparent}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after.horizontal{margin-left:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after.horizontal:after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after.horizontal:before{right:100%}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after.horizontal:after{border-left-color:transparent;border-right-color:#fff}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after.horizontal:before{border-left-color:transparent;border-right-color:#e3e4e6}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below.horizontal:after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below.horizontal:before{top:16px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below.horizontal:after{margin-top:1px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above.horizontal:after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above.horizontal:before{bottom:16px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above.horizontal:after{margin-bottom:1px}mat-card{box-shadow:none}mat-card-content{margin:8px 0}mat-card-actions{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}mat-card-actions .progress{font-size:12px;font-weight:600;color:#00000061;white-space:nowrap}mat-card-actions.no-progress{grid-template-columns:1fr 1fr}mat-card-actions>*{max-width:fit-content}mat-card-actions>*:last-child{justify-self:flex-end}mat-card-actions button.prev{padding-left:4px}mat-card-actions button.next{padding-right:4px}mat-card-header .header-group{display:flex;align-items:center;justify-content:space-between;margin-top:-8px;width:100%}mat-card-header .header-group mat-card-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}mat-card-header .header-group button{margin-right:-8px}\n"], dependencies: [{ kind: "ngmodule", type: MatCardModule }, { kind: "component", type: i3.MatCard, selector: "mat-card", inputs: ["appearance"], exportAs: ["matCard"] }, { kind: "directive", type: i3.MatCardActions, selector: "mat-card-actions", inputs: ["align"], exportAs: ["matCardActions"] }, { kind: "directive", type: i3.MatCardContent, selector: "mat-card-content" }, { kind: "component", type: i3.MatCardHeader, selector: "mat-card-header" }, { kind: "directive", type: i3.MatCardTitle, selector: "mat-card-title, [mat-card-title], [matCardTitle]" }, { kind: "ngmodule", type: MatMenuModule }, { kind: "component", type: i1.MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: MatButtonModule }, { kind: "component", type: i5.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: i5.MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i6.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourStepTemplateComponent, decorators: [{
            type: Component,
            args: [{ selector: 'tour-step-template', standalone: true, imports: [
                        MatCardModule,
                        MatMenuModule,
                        NgTemplateOutlet,
                        MatButtonModule,
                        MatIconModule
                    ], template: "<mat-menu [overlapTrigger]=\"false\">\n    <ng-container\n        *ngTemplateOutlet=\"\n            stepTemplate || stepTemplateContent || defaultTemplate;\n            context: { step: step }\n        \"\n    ></ng-container>\n</mat-menu>\n\n<ng-template #defaultTemplate let-step=\"step\">\n    <mat-card\n        (click)=\"$event.stopPropagation()\"\n        [style.width]=\"step.stepDimensions?.width\"\n        [style.min-width]=\"step.stepDimensions?.minWidth\"\n        [style.max-width]=\"step.stepDimensions?.maxWidth\"\n    >\n        <mat-card-header>\n            <div class=\"header-group\">\n                <mat-card-title>\n                    {{ step.title }}\n                </mat-card-title>\n                <button\n                    mat-icon-button\n                    (click)=\"tourService.end()\"\n                    class=\"close\"\n                >\n                    <mat-icon>close</mat-icon>\n                </button>\n            </div>\n        </mat-card-header>\n\n        <mat-card-content\n            class=\"mat-body\"\n            [innerHTML]=\"step.content\"\n        ></mat-card-content>\n\n        <mat-card-actions\n            [class.no-progress]=\"!step.showProgress\"\n        >\n            <button\n                mat-button\n                class=\"prev\"\n                [disabled]=\"!tourService.hasPrev(step)\"\n                (click)=\"tourService.prev()\"\n            >\n                <mat-icon>chevron_left</mat-icon>\n                {{ step.prevBtnTitle }}\n            </button>\n            @if (step.showProgress) {\n                <div class=\"progress\">{{ tourService.steps?.indexOf(step) + 1 }} / {{ tourService.steps?.length }}</div>\n            }\n            @if (tourService.hasNext(step) && !step.nextOnAnchorClick) {\n                <button\n                    class=\"next\"\n                    (click)=\"tourService.next()\"\n                    mat-button\n                >\n                    {{ step.nextBtnTitle }}\n                    <mat-icon iconPositionEnd>chevron_right</mat-icon>\n                </button>\n            }\n            @if (!tourService.hasNext(step)) {\n                <button\n                    mat-button\n                    (click)=\"tourService.end()\"\n                >\n                    {{ step.endBtnTitle }}\n                </button>\n            }\n        </mat-card-actions>\n    </mat-card>\n</ng-template>\n", styles: ["html{--mat-icon-button-touch-target-display: none}.mat-mdc-icon-button.mat-mdc-button-base{--mdc-icon-button-state-layer-size: 36px;width:var(--mdc-icon-button-state-layer-size);height:var(--mdc-icon-button-state-layer-size);padding:6px}::ng-deep .tour-step .mat-mdc-menu-content{padding:0!important}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step{min-width:unset;max-width:unset;overflow:unset;box-shadow:none;filter:drop-shadow(0px 5px 5px rgba(0,0,0,.2)) drop-shadow(0px 8px 10px rgba(0,0,0,.14))}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow{position:relative}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow:after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow:before{bottom:100%;border:solid transparent;content:\" \";height:0;width:0;position:absolute;pointer-events:none}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow:after{border-color:#fff0;border-width:8px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow:before{border-color:#e3e4e600;border-width:9px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before:not(.horizontal):after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before:not(.horizontal):before{right:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before:not(.horizontal):after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before:not(.horizontal):before{right:20px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before:not(.horizontal):before{margin-right:-1px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after:not(.horizontal):after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after:not(.horizontal):before{left:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after:not(.horizontal):after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after:not(.horizontal):before{left:20px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after:not(.horizontal):after{margin-left:1px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below:not(.horizontal){margin-top:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below:not(.horizontal):after{border-top-color:transparent;border-bottom-color:#fff}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below:not(.horizontal):before{border-top-color:transparent;border-bottom-color:#e3e4e6}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above:not(.horizontal){margin-bottom:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above:not(.horizontal):after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above:not(.horizontal):before{top:100%}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above:not(.horizontal):after{border-top-color:#fff;border-bottom-color:transparent}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above:not(.horizontal):before{border-top-color:#e3e4e6;border-bottom-color:transparent}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before.horizontal{margin-right:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before.horizontal:after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before.horizontal:before{left:100%}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before.horizontal:after{border-left-color:#fff;border-right-color:transparent}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-before.horizontal:before{border-left-color:#e3e4e6;border-right-color:transparent}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after.horizontal{margin-left:10px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after.horizontal:after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after.horizontal:before{right:100%}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after.horizontal:after{border-left-color:transparent;border-right-color:#fff}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-after.horizontal:before{border-left-color:transparent;border-right-color:#e3e4e6}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below.horizontal:after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below.horizontal:before{top:16px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-below.horizontal:after{margin-top:1px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above.horizontal:after,::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above.horizontal:before{bottom:16px}::ng-deep .mat-mdc-menu-panel.mat-mdc-menu-panel.tour-step.arrow.mat-menu-above.horizontal:after{margin-bottom:1px}mat-card{box-shadow:none}mat-card-content{margin:8px 0}mat-card-actions{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}mat-card-actions .progress{font-size:12px;font-weight:600;color:#00000061;white-space:nowrap}mat-card-actions.no-progress{grid-template-columns:1fr 1fr}mat-card-actions>*{max-width:fit-content}mat-card-actions>*:last-child{justify-self:flex-end}mat-card-actions button.prev{padding-left:4px}mat-card-actions button.next{padding-right:4px}mat-card-header .header-group{display:flex;align-items:center;justify-content:space-between;margin-top:-8px;width:100%}mat-card-header .header-group mat-card-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}mat-card-header .header-group button{margin-right:-8px}\n"] }]
        }], ctorParameters: () => [{ type: TourStepTemplateService }, { type: NgxmTourService }], propDecorators: { tourStep: [{
                type: ViewChild,
                args: [MatMenu]
            }], stepTemplate: [{
                type: Input
            }], stepTemplateContent: [{
                type: ContentChild,
                args: [TemplateRef]
            }] } });

class TourProxyAnchorComponent extends BaseTourProxyAnchor {
    constructor() {
        super(...arguments);
        // noinspection JSUnusedGlobalSymbols
        this.anchorDirective = inject(TourAnchorMatMenuDirective, {
            host: true
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourProxyAnchorComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.12", type: TourProxyAnchorComponent, isStandalone: true, selector: "tour-proxy-anchor", inputs: { anchorEl: "anchorEl" }, usesInheritance: true, hostDirectives: [{ directive: TourAnchorMatMenuDirective, inputs: ["tourAnchor", "anchorId"] }], ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
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

const COMPONENTS = [TourAnchorMatMenuDirective, TourStepTemplateComponent, TourProxyAnchorComponent];
class TourMatMenuModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourMatMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.12", ngImport: i0, type: TourMatMenuModule, imports: [TourAnchorMatMenuDirective, TourStepTemplateComponent, TourProxyAnchorComponent], exports: [TourAnchorMatMenuDirective, TourStepTemplateComponent, TourProxyAnchorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourMatMenuModule, imports: [TourStepTemplateComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourMatMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: COMPONENTS,
                    exports: COMPONENTS
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { TourAnchorMatMenuDirective, TourMatMenuModule, TourProxyAnchorComponent, NgxmTourService as TourService, TourStepTemplateComponent };
//# sourceMappingURL=ngx-ui-tour-md-menu.mjs.map
