import { inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { delay, filter, first, map, merge as mergeStatic, of, Subject, takeUntil, timeout } from 'rxjs';
import { ScrollingService } from './scrolling.service';
import { TourBackdropService } from './tour-backdrop.service';
import { AnchorClickService } from './anchor-click.service';
import { ScrollBlockingService } from './scroll-blocking.service';
import { deepMerge } from './utils';
import * as i0 from "@angular/core";
export var TourState;
(function (TourState) {
    TourState[TourState["OFF"] = 0] = "OFF";
    TourState[TourState["ON"] = 1] = "ON";
    TourState[TourState["PAUSED"] = 2] = "PAUSED";
})(TourState || (TourState = {}));
export var Direction;
(function (Direction) {
    Direction[Direction["Forwards"] = 0] = "Forwards";
    Direction[Direction["Backwards"] = 1] = "Backwards";
})(Direction || (Direction = {}));
const DEFAULT_STEP_OPTIONS = {
    disableScrollToAnchor: false,
    prevBtnTitle: 'Prev',
    nextBtnTitle: 'Next',
    endBtnTitle: 'End',
    enableBackdrop: false,
    isAsync: false,
    isOptional: false,
    delayAfterNavigation: 100,
    delayBeforeStepShow: 0,
    nextOnAnchorClick: false,
    duplicateAnchorHandling: 'error',
    centerAnchorOnScroll: true,
    disablePageScrolling: true,
    smoothScroll: true,
    allowUserInitiatedNavigation: false,
    stepDimensions: {
        minWidth: '250px',
        maxWidth: '280px',
        width: 'auto'
    },
    showProgress: true
};
// noinspection JSUnusedGlobalSymbols
export class TourService {
    constructor() {
        this.stepShow$ = new Subject();
        this.stepHide$ = new Subject();
        this.initialize$ = new Subject();
        this.start$ = new Subject();
        this.end$ = new Subject();
        this.pause$ = new Subject();
        this.resume$ = new Subject();
        this.anchorRegister$ = new Subject();
        this.anchorUnregister$ = new Subject();
        this.events$ = mergeStatic(this.stepShow$.pipe(map(value => ({ name: 'stepShow', value }))), this.stepHide$.pipe(map(value => ({ name: 'stepHide', value }))), this.initialize$.pipe(map(value => ({ name: 'initialize', value }))), this.start$.pipe(map(value => ({ name: 'start', value }))), this.end$.pipe(map(value => ({ name: 'end', value }))), this.pause$.pipe(map(value => ({ name: 'pause', value }))), this.resume$.pipe(map(value => ({ name: 'resume', value }))), this.anchorRegister$.pipe(map(value => ({
            name: 'anchorRegister',
            value
        }))), this.anchorUnregister$.pipe(map(value => ({
            name: 'anchorUnregister',
            value
        }))));
        this.steps = [];
        this.anchors = {};
        this.status = TourState.OFF;
        this.isHotKeysEnabled = true;
        this.direction = Direction.Forwards;
        this.waitingForScroll = false;
        this.navigationStarted = false;
        this.router = inject(Router);
        this.backdrop = inject(TourBackdropService);
        this.anchorClickService = inject(AnchorClickService);
        this.scrollBlockingService = inject(ScrollBlockingService);
        this.scrollingService = inject(ScrollingService);
    }
    initialize(steps, stepDefaults) {
        if (this.status === TourState.ON) {
            console.warn('Can not re-initialize the UI tour while it\'s still active');
            return;
        }
        if (steps && steps.length > 0) {
            this.status = TourState.OFF;
            this.steps = steps.map(step => deepMerge(DEFAULT_STEP_OPTIONS, this.userDefaults, stepDefaults, step));
            this.validateSteps();
            this.initialize$.next(this.steps);
            this.subscribeToNavigationStartEvent();
        }
    }
    setDefaults(defaultOptions) {
        this.userDefaults = defaultOptions;
    }
    getDefaults() {
        return this.userDefaults;
    }
    validateSteps() {
        for (const step of this.steps) {
            if (step.isAsync && step.isOptional && !step.asyncStepTimeout) {
                throw new Error(`Tour step with anchor id "${step.anchorId}" can only be both "async" and ` +
                    `"optional" when "asyncStepTimeout" is specified!`);
            }
        }
    }
    subscribeToNavigationStartEvent() {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationStart), takeUntil(this.end$))
            .subscribe((event) => {
            if (!this.currentStep) {
                return;
            }
            const browserBackBtnPressed = event.navigationTrigger === 'popstate', userNavigationAllowed = this.currentStep.allowUserInitiatedNavigation;
            if (!this.navigationStarted && (browserBackBtnPressed || !userNavigationAllowed)) {
                this.end();
            }
        });
    }
    disableHotkeys() {
        this.isHotKeysEnabled = false;
    }
    enableHotkeys() {
        this.isHotKeysEnabled = true;
    }
    start() {
        if (this.status === TourState.ON) {
            console.warn('tourService.start() called while the tour is already running.');
            return;
        }
        this.startAt(0);
    }
    startAt(stepId) {
        this.status = TourState.ON;
        this.goToStep(this.loadStep(stepId));
        this.start$.next();
    }
    end() {
        if (this.waitingForScroll) {
            return;
        }
        if (this.status === TourState.OFF) {
            return;
        }
        this.status = TourState.OFF;
        this.disableTour();
        this.currentStep = undefined;
        this.direction = Direction.Forwards;
        this.end$.next();
    }
    pause() {
        this.status = TourState.PAUSED;
        this.disableTour();
        this.pause$.next();
    }
    disableTour() {
        this.hideStep(this.currentStep);
        this.anchorClickService.removeListener();
        this.backdrop.close();
        this.backdrop.disconnectResizeObserver();
        this.scrollBlockingService.disable();
    }
    resume() {
        this.status = TourState.ON;
        this.showStep(this.currentStep);
        this.resume$.next();
    }
    toggle(pause) {
        if (pause) {
            if (this.currentStep) {
                this.pause();
            }
            else {
                this.resume();
            }
        }
        else {
            if (this.currentStep) {
                this.end();
            }
            else {
                this.start();
            }
        }
    }
    next() {
        if (this.waitingForScroll) {
            return;
        }
        this.direction = Direction.Forwards;
        if (this.hasNext(this.currentStep)) {
            this.goToStep(this.loadStep(this.currentStep.nextStep ?? this.getStepIndex(this.currentStep) + 1));
        }
    }
    getStepIndex(step) {
        const index = this.steps.indexOf(step);
        return index < 0 ? 0 : index;
    }
    hasNext(step) {
        if (!step) {
            console.warn('Can\'t get next step. No currentStep.');
            return false;
        }
        return (step.nextStep !== undefined ||
            (this.getStepIndex(step) < this.steps.length - 1 && !this.isNextOptionalAnchorMissing(step)));
    }
    isNextOptionalAnchorMissing(step) {
        const stepIndex = this.getStepIndex(step);
        for (let i = stepIndex + 1; i < this.steps.length; i++) {
            const nextStep = this.steps[i];
            if (!nextStep.isOptional || this.anchors[nextStep.anchorId])
                return false;
        }
        return true;
    }
    prev() {
        if (this.waitingForScroll) {
            return;
        }
        this.direction = Direction.Backwards;
        if (this.hasPrev(this.currentStep)) {
            this.goToStep(this.loadStep(this.currentStep.prevStep ?? this.getStepIndex(this.currentStep) - 1));
        }
    }
    hasPrev(step) {
        if (!step) {
            console.warn('Can\'t get previous step. No currentStep.');
            return false;
        }
        return step.prevStep !== undefined ||
            (this.getStepIndex(step) > 0 && !this.isPrevOptionalAnchorMising(step));
    }
    isPrevOptionalAnchorMising(step) {
        const stepIndex = this.getStepIndex(step);
        for (let i = stepIndex - 1; i > -1; i--) {
            const prevStep = this.steps[i];
            if (!prevStep.isOptional || this.anchors[prevStep.anchorId])
                return false;
        }
        return true;
    }
    goto(stepId) {
        this.goToStep(this.loadStep(stepId));
    }
    register(anchorId, anchor) {
        if (!anchorId) {
            return;
        }
        if (this.anchors[anchorId]) {
            const step = this.findStepByAnchorId(anchorId), duplicateAnchorHandling = step?.duplicateAnchorHandling ??
                this.userDefaults?.duplicateAnchorHandling ?? 'error';
            switch (duplicateAnchorHandling) {
                case 'error':
                    throw new Error(`Tour anchor with id "${anchorId}" already registered!`);
                case 'registerFirst':
                    return;
            }
        }
        this.anchors[anchorId] = anchor;
        this.anchorRegister$.next(anchorId);
    }
    findStepByAnchorId(anchorId) {
        return this.steps.find(step => step.anchorId === anchorId);
    }
    unregister(anchorId) {
        if (!anchorId) {
            return;
        }
        delete this.anchors[anchorId];
        this.anchorUnregister$.next(anchorId);
    }
    getStatus() {
        return this.status;
    }
    isHotkeysEnabled() {
        return this.isHotKeysEnabled;
    }
    goToStep(step) {
        if (!step) {
            console.warn('Can\'t go to non-existent step');
            this.end();
            return;
        }
        if (this.currentStep) {
            this.backdrop.closeSpotlight();
            this.hideStep(this.currentStep);
        }
        this.anchorClickService.removeListener();
        if (step.route !== undefined && step.route !== null) {
            this.navigateToRouteAndSetStep(step);
        }
        else {
            this.setCurrentStepAsync(step);
        }
    }
    listenToOnAnchorClick(step) {
        if (step.nextOnAnchorClick) {
            const anchorEl = this.anchors[step.anchorId].element.nativeElement;
            this.anchorClickService.addListener(anchorEl, () => this.next());
        }
    }
    async navigateToRouteAndSetStep(step) {
        const url = typeof step.route === 'string' ? step.route : this.router.createUrlTree(step.route), matchOptions = {
            paths: 'exact',
            matrixParams: 'exact',
            queryParams: 'subset',
            fragment: 'exact'
        };
        const isActive = this.router.isActive(url, matchOptions);
        if (isActive) {
            this.setCurrentStepAsync(step);
            return;
        }
        this.navigationStarted = true;
        const navigated = await this.router.navigateByUrl(url);
        this.navigationStarted = false;
        if (!navigated) {
            console.warn('Navigation to route failed: ', step.route);
            this.end();
        }
        else {
            this.setCurrentStepAsync(step, step.delayAfterNavigation);
        }
    }
    loadStep(stepId) {
        if (typeof stepId === 'number') {
            return this.steps[stepId];
        }
        else {
            return this.steps.find(step => step.stepId === stepId);
        }
    }
    setCurrentStep(step) {
        this.currentStep = step;
        this.showStep(this.currentStep);
    }
    setCurrentStepAsync(step, delay = 0) {
        delay = delay || step.delayBeforeStepShow;
        setTimeout(() => this.setCurrentStep(step), delay);
    }
    async showStep(step, skipAsync = false) {
        const anchor = this.anchors[step && step.anchorId];
        if (!anchor) {
            if (step.isAsync && !skipAsync) {
                let anchorRegistered$ = this.anchorRegister$
                    .pipe(filter(anchorId => anchorId === step.anchorId), first(), delay(0));
                if (step.asyncStepTimeout) {
                    anchorRegistered$ = anchorRegistered$
                        .pipe(timeout({
                        each: step.asyncStepTimeout,
                        with: () => of(null)
                    }));
                }
                anchorRegistered$
                    .subscribe(() => this.showStep(step, true));
                return;
            }
            if (step.isOptional) {
                this.direction === Direction.Forwards ? this.next() : this.prev();
                return;
            }
            console.warn(`Can't attach to unregistered anchor with id "${step.anchorId}"`);
            this.end();
            return;
        }
        this.listenToOnAnchorClick(step);
        this.waitingForScroll = true;
        await this.scrollToAnchor(step);
        this.waitingForScroll = false;
        anchor.showTourStep(step);
        this.toggleBackdrop(step);
        this.togglePageScrolling(step);
        this.stepShow$.next({
            step,
            direction: this.direction
        });
    }
    hideStep(step) {
        const anchor = this.anchors[step && step.anchorId];
        if (!anchor) {
            return;
        }
        anchor.hideTourStep();
        this.stepHide$.next({
            step,
            direction: this.direction
        });
    }
    scrollToAnchor(step) {
        if (step.disableScrollToAnchor) {
            return Promise.resolve();
        }
        const anchor = this.anchors[step?.anchorId], htmlElement = anchor.element.nativeElement;
        return this.scrollingService.ensureVisible(htmlElement, {
            center: step.centerAnchorOnScroll,
            smoothScroll: step.smoothScroll,
            scrollContainer: step.scrollContainer
        });
    }
    toggleBackdrop(step) {
        const anchor = this.anchors[step?.anchorId];
        if (step.enableBackdrop) {
            this.backdrop.show(anchor.element, step);
        }
        else {
            this.backdrop.close();
        }
    }
    togglePageScrolling(step) {
        if (step.disablePageScrolling) {
            this.scrollBlockingService.enable(step.scrollContainer);
        }
        else {
            this.scrollBlockingService.disable();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91ci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXVpLXRvdXItY29yZS9zcmMvbGliL3RvdXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVqRCxPQUFPLEVBQXVCLGVBQWUsRUFBRSxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUc5RSxPQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssSUFBSSxXQUFXLEVBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2xILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBaUIsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sU0FBUyxDQUFDOztBQTRDbEMsTUFBTSxDQUFOLElBQVksU0FJWDtBQUpELFdBQVksU0FBUztJQUNqQix1Q0FBRyxDQUFBO0lBQ0gscUNBQUUsQ0FBQTtJQUNGLDZDQUFNLENBQUE7QUFDVixDQUFDLEVBSlcsU0FBUyxLQUFULFNBQVMsUUFJcEI7QUFFRCxNQUFNLENBQU4sSUFBWSxTQUdYO0FBSEQsV0FBWSxTQUFTO0lBQ2pCLGlEQUFRLENBQUE7SUFDUixtREFBUyxDQUFBO0FBQ2IsQ0FBQyxFQUhXLFNBQVMsS0FBVCxTQUFTLFFBR3BCO0FBT0QsTUFBTSxvQkFBb0IsR0FBZ0I7SUFDdEMscUJBQXFCLEVBQUUsS0FBSztJQUM1QixZ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b250ZW50IjpbImltcG9ydCB7aW5qZWN0LCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB0eXBlIHtVcmxTZWdtZW50fSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtJc0FjdGl2ZU1hdGNoT3B0aW9ucywgTmF2aWdhdGlvblN0YXJ0LCBSb3V0ZXJ9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7VG91ckFuY2hvckRpcmVjdGl2ZX0gZnJvbSAnLi90b3VyLWFuY2hvci5kaXJlY3RpdmUnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCBmaXJzdCwgbWFwLCBtZXJnZSBhcyBtZXJnZVN0YXRpYywgT2JzZXJ2YWJsZSwgb2YsIFN1YmplY3QsIHRha2VVbnRpbCwgdGltZW91dH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1Njcm9sbGluZ1NlcnZpY2V9IGZyb20gJy4vc2Nyb2xsaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHtCYWNrZHJvcENvbmZpZywgVG91ckJhY2tkcm9wU2VydmljZX0gZnJvbSAnLi90b3VyLWJhY2tkcm9wLnNlcnZpY2UnO1xuaW1wb3J0IHtBbmNob3JDbGlja1NlcnZpY2V9IGZyb20gJy4vYW5jaG9yLWNsaWNrLnNlcnZpY2UnO1xuaW1wb3J0IHtTY3JvbGxCbG9ja2luZ1NlcnZpY2V9IGZyb20gJy4vc2Nyb2xsLWJsb2NraW5nLnNlcnZpY2UnO1xuaW1wb3J0IHtkZWVwTWVyZ2V9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0ZXBEaW1lbnNpb25zIHtcbiAgICB3aWR0aD86IHN0cmluZztcbiAgICBtaW5XaWR0aD86IHN0cmluZztcbiAgICBtYXhXaWR0aD86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJU3RlcE9wdGlvbiB7XG4gICAgc3RlcElkPzogc3RyaW5nO1xuICAgIGFuY2hvcklkPzogc3RyaW5nO1xuICAgIHRpdGxlPzogc3RyaW5nO1xuICAgIGNvbnRlbnQ/OiBzdHJpbmc7XG4gICAgcm91dGU/OiBzdHJpbmcgfCBVcmxTZWdtZW50W107XG4gICAgbmV4dFN0ZXA/OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgcHJldlN0ZXA/OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgZGlzYWJsZVNjcm9sbFRvQW5jaG9yPzogYm9vbGVhbjtcbiAgICBjZW50ZXJBbmNob3JPblNjcm9sbD86IGJvb2xlYW47XG4gICAgc21vb3RoU2Nyb2xsPzogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBDU1Mgc2VsZWN0b3Igb3IgaHRtbCBlbGVtZW50IHJlZmVyZW5jZS4gT25seSBzZXQgdGhpcyBjb25maWcgaWYgeW91IGhhdmUgZW5hYmxlZCBcInNtb290aFNjcm9sbFwiIGFuZCB0b3VyIHN0ZXBcbiAgICAgKiBkZXNjcmlwdGlvbiBwb3BzLXVwIGJlZm9yZSBzY3JvbGxpbmcgaGFzIGZpbmlzaGVkIG9yIGRvZXNuJ3Qgc2hvdyB1cCBhdCBhbGwuIFRoaXMgc2hvdWxkIG9ubHkgYmUgdGhlIGNhc2Ugd2hlblxuICAgICAqIHNjcm9sbCBjb250YWluZXIgaXMgcGFydCBvZiBzaGFkb3cgRE9NLlxuICAgICAqL1xuICAgIHNjcm9sbENvbnRhaW5lcj86IHN0cmluZyB8IEhUTUxFbGVtZW50O1xuICAgIHByZXZCdG5UaXRsZT86IHN0cmluZztcbiAgICBuZXh0QnRuVGl0bGU/OiBzdHJpbmc7XG4gICAgZW5kQnRuVGl0bGU/OiBzdHJpbmc7XG4gICAgZW5hYmxlQmFja2Ryb3A/OiBib29sZWFuO1xuICAgIGJhY2tkcm9wQ29uZmlnPzogQmFja2Ryb3BDb25maWc7XG4gICAgaXNBc3luYz86IGJvb2xlYW47XG4gICAgYXN5bmNTdGVwVGltZW91dD86IG51bWJlcjtcbiAgICBpc09wdGlvbmFsPzogYm9vbGVhbjtcbiAgICBkZWxheUFmdGVyTmF2aWdhdGlvbj86IG51bWJlcjtcbiAgICBkZWxheUJlZm9yZVN0ZXBTaG93PzogbnVtYmVyO1xuICAgIG5leHRPbkFuY2hvckNsaWNrPzogYm9vbGVhbjtcbiAgICBkdXBsaWNhdGVBbmNob3JIYW5kbGluZz86ICdlcnJvcicgfCAncmVnaXN0ZXJGaXJzdCcgfCAncmVnaXN0ZXJMYXN0JztcbiAgICBkaXNhYmxlUGFnZVNjcm9sbGluZz86IGJvb2xlYW47XG4gICAgYWxsb3dVc2VySW5pdGlhdGVkTmF2aWdhdGlvbj86IGJvb2xlYW47XG4gICAgc3RlcERpbWVuc2lvbnM/OiBTdGVwRGltZW5zaW9ucztcbiAgICBwb3BvdmVyQ2xhc3M/OiBzdHJpbmc7XG4gICAgc2hvd1Byb2dyZXNzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGVudW0gVG91clN0YXRlIHtcbiAgICBPRkYsXG4gICAgT04sXG4gICAgUEFVU0VEXG59XG5cbmV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XG4gICAgRm9yd2FyZHMsXG4gICAgQmFja3dhcmRzXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RlcENoYW5nZVBhcmFtczxUIGV4dGVuZHMgSVN0ZXBPcHRpb24gPSBJU3RlcE9wdGlvbj4ge1xuICAgIHN0ZXA6IFQ7XG4gICAgZGlyZWN0aW9uOiBEaXJlY3Rpb247XG59XG5cbmNvbnN0IERFRkFVTFRfU1RFUF9PUFRJT05TOiBJU3RlcE9wdGlvbiA9IHtcbiAgICBkaXNhYmxlU2Nyb2xsVG9BbmNob3I6IGZhbHNlLFxuICAgIHByZXZCdG5UaXRsZTogJ1ByZXYnLFxuICAgIG5leHRCdG5UaXRsZTogJ05leHQnLFxuICAgIGVuZEJ0blRpdGxlOiAnRW5kJyxcbiAgICBlbmFibGVCYWNrZHJvcDogZmFsc2UsXG4gICAgaXNBc3luYzogZmFsc2UsXG4gICAgaXNPcHRpb25hbDogZmFsc2UsXG4gICAgZGVsYXlBZnRlck5hdmlnYXRpb246IDEwMCxcbiAgICBkZWxheUJlZm9yZVN0ZXBTaG93OiAwLFxuICAgIG5leHRPbkFuY2hvckNsaWNrOiBmYWxzZSxcbiAgICBkdXBsaWNhdGVBbmNob3JIYW5kbGluZzogJ2Vycm9yJyxcbiAgICBjZW50ZXJBbmNob3JPblNjcm9sbDogdHJ1ZSxcbiAgICBkaXNhYmxlUGFnZVNjcm9sbGluZzogdHJ1ZSxcbiAgICBzbW9vdGhTY3JvbGw6IHRydWUsXG4gICAgYWxsb3dVc2VySW5pdGlhdGVkTmF2aWdhdGlvbjogZmFsc2UsXG4gICAgc3RlcERpbWVuc2lvbnM6IHtcbiAgICAgICAgbWluV2lkdGg6ICcyNTBweCcsXG4gICAgICAgIG1heFdpZHRoOiAnMjgwcHgnLFxuICAgICAgICB3aWR0aDogJ2F1dG8nXG4gICAgfSxcbiAgICBzaG93UHJvZ3Jlc3M6IHRydWVcbn07XG5cbi8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgVG91clNlcnZpY2U8VCBleHRlbmRzIElTdGVwT3B0aW9uID0gSVN0ZXBPcHRpb24+IHtcblxuICAgIHB1YmxpYyBzdGVwU2hvdyQ6IFN1YmplY3Q8U3RlcENoYW5nZVBhcmFtczxUPj4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBzdGVwSGlkZSQ6IFN1YmplY3Q8U3RlcENoYW5nZVBhcmFtczxUPj4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBpbml0aWFsaXplJDogU3ViamVjdDxUW10+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgc3RhcnQkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgZW5kJDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIHBhdXNlJDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIHJlc3VtZSQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBhbmNob3JSZWdpc3RlciQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIGFuY2hvclVucmVnaXN0ZXIkOiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBldmVudHMkOiBPYnNlcnZhYmxlPHsgbmFtZTogc3RyaW5nOyB2YWx1ZTogdW5rbm93biB9PiA9IG1lcmdlU3RhdGljKFxuICAgICAgICB0aGlzLnN0ZXBTaG93JC5waXBlKG1hcCh2YWx1ZSA9PiAoe25hbWU6ICdzdGVwU2hvdycsIHZhbHVlfSkpKSxcbiAgICAgICAgdGhpcy5zdGVwSGlkZSQucGlwZShtYXAodmFsdWUgPT4gKHtuYW1lOiAnc3RlcEhpZGUnLCB2YWx1ZX0pKSksXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSQucGlwZShtYXAodmFsdWUgPT4gKHtuYW1lOiAnaW5pdGlhbGl6ZScsIHZhbHVlfSkpKSxcbiAgICAgICAgdGhpcy5zdGFydCQucGlwZShtYXAodmFsdWUgPT4gKHtuYW1lOiAnc3RhcnQnLCB2YWx1ZX0pKSksXG4gICAgICAgIHRoaXMuZW5kJC5waXBlKG1hcCh2YWx1ZSA9PiAoe25hbWU6ICdlbmQnLCB2YWx1ZX0pKSksXG4gICAgICAgIHRoaXMucGF1c2UkLnBpcGUobWFwKHZhbHVlID0+ICh7bmFtZTogJ3BhdXNlJywgdmFsdWV9KSkpLFxuICAgICAgICB0aGlzLnJlc3VtZSQucGlwZShtYXAodmFsdWUgPT4gKHtuYW1lOiAncmVzdW1lJywgdmFsdWV9KSkpLFxuICAgICAgICB0aGlzLmFuY2hvclJlZ2lzdGVyJC5waXBlKFxuICAgICAgICAgICAgbWFwKHZhbHVlID0+ICh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2FuY2hvclJlZ2lzdGVyJyxcbiAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgfSkpXG4gICAgICAgICksXG4gICAgICAgIHRoaXMuYW5jaG9yVW5yZWdpc3RlciQucGlwZShcbiAgICAgICAgICAgIG1hcCh2YWx1ZSA9PiAoe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdhbmNob3JVbnJlZ2lzdGVyJyxcbiAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgfSkpXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgcHVibGljIHN0ZXBzOiBUW10gPSBbXTtcbiAgICBwdWJsaWMgY3VycmVudFN0ZXA6IFQ7XG5cbiAgICBwdWJsaWMgYW5jaG9yczogeyBbYW5jaG9ySWQ6IHN0cmluZ106IFRvdXJBbmNob3JEaXJlY3RpdmUgfSA9IHt9O1xuICAgIHByaXZhdGUgc3RhdHVzOiBUb3VyU3RhdGUgPSBUb3VyU3RhdGUuT0ZGO1xuICAgIHByaXZhdGUgaXNIb3RLZXlzRW5hYmxlZCA9IHRydWU7XG4gICAgcHJpdmF0ZSBkaXJlY3Rpb24gPSBEaXJlY3Rpb24uRm9yd2FyZHM7XG4gICAgcHJpdmF0ZSB3YWl0aW5nRm9yU2Nyb2xsID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBuYXZpZ2F0aW9uU3RhcnRlZCA9IGZhbHNlO1xuICAgIHByaXZhdGUgdXNlckRlZmF1bHRzOiBUO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXIgPSBpbmplY3QoUm91dGVyKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGJhY2tkcm9wID0gaW5qZWN0KFRvdXJCYWNrZHJvcFNlcnZpY2UpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYW5jaG9yQ2xpY2tTZXJ2aWNlID0gaW5qZWN0KEFuY2hvckNsaWNrU2VydmljZSk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBzY3JvbGxCbG9ja2luZ1NlcnZpY2UgPSBpbmplY3QoU2Nyb2xsQmxvY2tpbmdTZXJ2aWNlKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNjcm9sbGluZ1NlcnZpY2UgPSBpbmplY3QoU2Nyb2xsaW5nU2VydmljZSk7XG5cbiAgICBwdWJsaWMgaW5pdGlhbGl6ZShzdGVwczogVFtdLCBzdGVwRGVmYXVsdHM/OiBUKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gVG91clN0YXRlLk9OKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NhbiBub3QgcmUtaW5pdGlhbGl6ZSB0aGUgVUkgdG91ciB3aGlsZSBpdFxcJ3Mgc3RpbGwgYWN0aXZlJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RlcHMgJiYgc3RlcHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBUb3VyU3RhdGUuT0ZGO1xuICAgICAgICAgICAgdGhpcy5zdGVwcyA9IHN0ZXBzLm1hcChcbiAgICAgICAgICAgICAgICBzdGVwID0+IGRlZXBNZXJnZShcbiAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9TVEVQX09QVElPTlMgYXMgVCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VyRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBEZWZhdWx0cyxcbiAgICAgICAgICAgICAgICAgICAgc3RlcFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlU3RlcHMoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZSQubmV4dCh0aGlzLnN0ZXBzKTtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlVG9OYXZpZ2F0aW9uU3RhcnRFdmVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNldERlZmF1bHRzKGRlZmF1bHRPcHRpb25zOiBUKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXNlckRlZmF1bHRzID0gZGVmYXVsdE9wdGlvbnM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERlZmF1bHRzKCk6IFQge1xuICAgICAgICByZXR1cm4gdGhpcy51c2VyRGVmYXVsdHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZVN0ZXBzKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHN0ZXAgb2YgdGhpcy5zdGVwcykge1xuICAgICAgICAgICAgaWYgKHN0ZXAuaXNBc3luYyAmJiBzdGVwLmlzT3B0aW9uYWwgJiYgIXN0ZXAuYXN5bmNTdGVwVGltZW91dCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVG91ciBzdGVwIHdpdGggYW5jaG9yIGlkIFwiJHtzdGVwLmFuY2hvcklkfVwiIGNhbiBvbmx5IGJlIGJvdGggXCJhc3luY1wiIGFuZCBgICtcbiAgICAgICAgICAgICAgICAgICAgYFwib3B0aW9uYWxcIiB3aGVuIFwiYXN5bmNTdGVwVGltZW91dFwiIGlzIHNwZWNpZmllZCFgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3Vic2NyaWJlVG9OYXZpZ2F0aW9uU3RhcnRFdmVudCgpXG4gICAge1xuICAgICAgICB0aGlzLnJvdXRlci5ldmVudHNcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIGZpbHRlcigoZXZlbnQpOiBldmVudCBpcyBOYXZpZ2F0aW9uU3RhcnQgPT4gZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpLFxuICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLmVuZCQpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudFN0ZXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJyb3dzZXJCYWNrQnRuUHJlc3NlZCA9IGV2ZW50Lm5hdmlnYXRpb25UcmlnZ2VyID09PSAncG9wc3RhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgIHVzZXJOYXZpZ2F0aW9uQWxsb3dlZCA9IHRoaXMuY3VycmVudFN0ZXAuYWxsb3dVc2VySW5pdGlhdGVkTmF2aWdhdGlvbjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMubmF2aWdhdGlvblN0YXJ0ZWQgJiYgKGJyb3dzZXJCYWNrQnRuUHJlc3NlZCB8fCAhdXNlck5hdmlnYXRpb25BbGxvd2VkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGRpc2FibGVIb3RrZXlzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmlzSG90S2V5c0VuYWJsZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5hYmxlSG90a2V5cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pc0hvdEtleXNFbmFibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gVG91clN0YXRlLk9OKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ3RvdXJTZXJ2aWNlLnN0YXJ0KCkgY2FsbGVkIHdoaWxlIHRoZSB0b3VyIGlzIGFscmVhZHkgcnVubmluZy4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXJ0QXQoMCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0QXQoc3RlcElkOiBudW1iZXIgfCBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBUb3VyU3RhdGUuT047XG4gICAgICAgIHRoaXMuZ29Ub1N0ZXAodGhpcy5sb2FkU3RlcChzdGVwSWQpKTtcbiAgICAgICAgdGhpcy5zdGFydCQubmV4dCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLndhaXRpbmdGb3JTY3JvbGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gVG91clN0YXRlLk9GRikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdHVzID0gVG91clN0YXRlLk9GRjtcbiAgICAgICAgdGhpcy5kaXNhYmxlVG91cigpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERpcmVjdGlvbi5Gb3J3YXJkcztcbiAgICAgICAgdGhpcy5lbmQkLm5leHQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcGF1c2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gVG91clN0YXRlLlBBVVNFRDtcbiAgICAgICAgdGhpcy5kaXNhYmxlVG91cigpO1xuICAgICAgICB0aGlzLnBhdXNlJC5uZXh0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkaXNhYmxlVG91cigpIHtcbiAgICAgICAgdGhpcy5oaWRlU3RlcCh0aGlzLmN1cnJlbnRTdGVwKTtcbiAgICAgICAgdGhpcy5hbmNob3JDbGlja1NlcnZpY2UucmVtb3ZlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5iYWNrZHJvcC5jbG9zZSgpO1xuICAgICAgICB0aGlzLmJhY2tkcm9wLmRpc2Nvbm5lY3RSZXNpemVPYnNlcnZlcigpO1xuICAgICAgICB0aGlzLnNjcm9sbEJsb2NraW5nU2VydmljZS5kaXNhYmxlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc3VtZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBUb3VyU3RhdGUuT047XG4gICAgICAgIHRoaXMuc2hvd1N0ZXAodGhpcy5jdXJyZW50U3RlcCk7XG4gICAgICAgIHRoaXMucmVzdW1lJC5uZXh0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvZ2dsZShwYXVzZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHBhdXNlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5leHQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLndhaXRpbmdGb3JTY3JvbGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9uLkZvcndhcmRzO1xuICAgICAgICBpZiAodGhpcy5oYXNOZXh0KHRoaXMuY3VycmVudFN0ZXApKSB7XG4gICAgICAgICAgICB0aGlzLmdvVG9TdGVwKFxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFN0ZXAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFN0ZXAubmV4dFN0ZXAgPz8gdGhpcy5nZXRTdGVwSW5kZXgodGhpcy5jdXJyZW50U3RlcCkgKyAxXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3RlcEluZGV4KHN0ZXA6IFQpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuc3RlcHMuaW5kZXhPZihzdGVwKTtcblxuICAgICAgICByZXR1cm4gaW5kZXggPCAwID8gMCA6IGluZGV4O1xuICAgIH1cblxuICAgIHB1YmxpYyBoYXNOZXh0KHN0ZXA6IFQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFzdGVwKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NhblxcJ3QgZ2V0IG5leHQgc3RlcC4gTm8gY3VycmVudFN0ZXAuJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHN0ZXAubmV4dFN0ZXAgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgKHRoaXMuZ2V0U3RlcEluZGV4KHN0ZXApIDwgdGhpcy5zdGVwcy5sZW5ndGggLSAxICYmICF0aGlzLmlzTmV4dE9wdGlvbmFsQW5jaG9yTWlzc2luZyhzdGVwKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzTmV4dE9wdGlvbmFsQW5jaG9yTWlzc2luZyhzdGVwOiBUKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN0ZXBJbmRleCA9IHRoaXMuZ2V0U3RlcEluZGV4KHN0ZXApO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBzdGVwSW5kZXggKyAxOyBpIDwgdGhpcy5zdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbmV4dFN0ZXAgPSB0aGlzLnN0ZXBzW2ldO1xuXG4gICAgICAgICAgICBpZiAoIW5leHRTdGVwLmlzT3B0aW9uYWwgfHwgdGhpcy5hbmNob3JzW25leHRTdGVwLmFuY2hvcklkXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJldigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMud2FpdGluZ0ZvclNjcm9sbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBEaXJlY3Rpb24uQmFja3dhcmRzO1xuICAgICAgICBpZiAodGhpcy5oYXNQcmV2KHRoaXMuY3VycmVudFN0ZXApKSB7XG4gICAgICAgICAgICB0aGlzLmdvVG9TdGVwKFxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFN0ZXAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFN0ZXAucHJldlN0ZXAgPz8gdGhpcy5nZXRTdGVwSW5kZXgodGhpcy5jdXJyZW50U3RlcCkgLSAxXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBoYXNQcmV2KHN0ZXA6IFQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFzdGVwKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NhblxcJ3QgZ2V0IHByZXZpb3VzIHN0ZXAuIE5vIGN1cnJlbnRTdGVwLicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGVwLnByZXZTdGVwICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICh0aGlzLmdldFN0ZXBJbmRleChzdGVwKSA+IDAgJiYgIXRoaXMuaXNQcmV2T3B0aW9uYWxBbmNob3JNaXNpbmcoc3RlcCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNQcmV2T3B0aW9uYWxBbmNob3JNaXNpbmcoc3RlcDogVCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBzdGVwSW5kZXggPSB0aGlzLmdldFN0ZXBJbmRleChzdGVwKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gc3RlcEluZGV4IC0gMTsgaSA+IC0xOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHByZXZTdGVwID0gdGhpcy5zdGVwc1tpXTtcblxuICAgICAgICAgICAgaWYgKCFwcmV2U3RlcC5pc09wdGlvbmFsIHx8IHRoaXMuYW5jaG9yc1twcmV2U3RlcC5hbmNob3JJZF0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHVibGljIGdvdG8oc3RlcElkOiBudW1iZXIgfCBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5nb1RvU3RlcCh0aGlzLmxvYWRTdGVwKHN0ZXBJZCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3RlcihhbmNob3JJZDogc3RyaW5nLCBhbmNob3I6IFRvdXJBbmNob3JEaXJlY3RpdmUpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFhbmNob3JJZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYW5jaG9yc1thbmNob3JJZF0pIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLmZpbmRTdGVwQnlBbmNob3JJZChhbmNob3JJZCksXG4gICAgICAgICAgICAgICAgZHVwbGljYXRlQW5jaG9ySGFuZGxpbmcgPSBzdGVwPy5kdXBsaWNhdGVBbmNob3JIYW5kbGluZyA/P1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJEZWZhdWx0cz8uZHVwbGljYXRlQW5jaG9ySGFuZGxpbmcgPz8gJ2Vycm9yJztcblxuICAgICAgICAgICAgc3dpdGNoIChkdXBsaWNhdGVBbmNob3JIYW5kbGluZykge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUb3VyIGFuY2hvciB3aXRoIGlkIFwiJHthbmNob3JJZH1cIiBhbHJlYWR5IHJlZ2lzdGVyZWQhYCk7XG4gICAgICAgICAgICAgICAgY2FzZSAncmVnaXN0ZXJGaXJzdCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYW5jaG9yc1thbmNob3JJZF0gPSBhbmNob3I7XG4gICAgICAgIHRoaXMuYW5jaG9yUmVnaXN0ZXIkLm5leHQoYW5jaG9ySWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmluZFN0ZXBCeUFuY2hvcklkKGFuY2hvcklkOiBzdHJpbmcpOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RlcHMuZmluZChzdGVwID0+IHN0ZXAuYW5jaG9ySWQgPT09IGFuY2hvcklkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdW5yZWdpc3RlcihhbmNob3JJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICghYW5jaG9ySWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5hbmNob3JzW2FuY2hvcklkXTtcbiAgICAgICAgdGhpcy5hbmNob3JVbnJlZ2lzdGVyJC5uZXh0KGFuY2hvcklkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U3RhdHVzKCk6IFRvdXJTdGF0ZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXR1cztcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNIb3RrZXlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIb3RLZXlzRW5hYmxlZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdvVG9TdGVwKHN0ZXA6IFQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFzdGVwKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NhblxcJ3QgZ28gdG8gbm9uLWV4aXN0ZW50IHN0ZXAnKTtcbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0ZXApIHtcbiAgICAgICAgICAgIHRoaXMuYmFja2Ryb3AuY2xvc2VTcG90bGlnaHQoKTtcbiAgICAgICAgICAgIHRoaXMuaGlkZVN0ZXAodGhpcy5jdXJyZW50U3RlcCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFuY2hvckNsaWNrU2VydmljZS5yZW1vdmVMaXN0ZW5lcigpO1xuXG4gICAgICAgIGlmIChzdGVwLnJvdXRlICE9PSB1bmRlZmluZWQgJiYgc3RlcC5yb3V0ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvUm91dGVBbmRTZXRTdGVwKHN0ZXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRDdXJyZW50U3RlcEFzeW5jKHN0ZXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsaXN0ZW5Ub09uQW5jaG9yQ2xpY2soc3RlcDogVCkge1xuICAgICAgICBpZiAoc3RlcC5uZXh0T25BbmNob3JDbGljaykge1xuICAgICAgICAgICAgY29uc3QgYW5jaG9yRWwgPSB0aGlzLmFuY2hvcnNbc3RlcC5hbmNob3JJZF0uZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5hbmNob3JDbGlja1NlcnZpY2UuYWRkTGlzdGVuZXIoYW5jaG9yRWwsICgpID0+IHRoaXMubmV4dCgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgbmF2aWdhdGVUb1JvdXRlQW5kU2V0U3RlcChzdGVwOiBUKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHR5cGVvZiBzdGVwLnJvdXRlID09PSAnc3RyaW5nJyA/IHN0ZXAucm91dGUgOiB0aGlzLnJvdXRlci5jcmVhdGVVcmxUcmVlKHN0ZXAucm91dGUpLFxuICAgICAgICAgICAgbWF0Y2hPcHRpb25zOiBJc0FjdGl2ZU1hdGNoT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBwYXRoczogJ2V4YWN0JyxcbiAgICAgICAgICAgICAgICBtYXRyaXhQYXJhbXM6ICdleGFjdCcsXG4gICAgICAgICAgICAgICAgcXVlcnlQYXJhbXM6ICdzdWJzZXQnLFxuICAgICAgICAgICAgICAgIGZyYWdtZW50OiAnZXhhY3QnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5yb3V0ZXIuaXNBY3RpdmUodXJsLCBtYXRjaE9wdGlvbnMpO1xuXG4gICAgICAgIGlmIChpc0FjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRDdXJyZW50U3RlcEFzeW5jKHN0ZXApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5uYXZpZ2F0aW9uU3RhcnRlZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IG5hdmlnYXRlZCA9IGF3YWl0IHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsKTtcbiAgICAgICAgdGhpcy5uYXZpZ2F0aW9uU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghbmF2aWdhdGVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ05hdmlnYXRpb24gdG8gcm91dGUgZmFpbGVkOiAnLCBzdGVwLnJvdXRlKTtcbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldEN1cnJlbnRTdGVwQXN5bmMoc3RlcCwgc3RlcC5kZWxheUFmdGVyTmF2aWdhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRTdGVwKHN0ZXBJZDogbnVtYmVyIHwgc3RyaW5nKTogVCB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RlcElkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RlcHNbc3RlcElkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0ZXBzLmZpbmQoc3RlcCA9PiBzdGVwLnN0ZXBJZCA9PT0gc3RlcElkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Q3VycmVudFN0ZXAoc3RlcDogVCk6IHZvaWQge1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGVwID0gc3RlcDtcbiAgICAgICAgdGhpcy5zaG93U3RlcCh0aGlzLmN1cnJlbnRTdGVwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEN1cnJlbnRTdGVwQXN5bmMoc3RlcDogVCwgZGVsYXkgPSAwKTogdm9pZCB7XG4gICAgICAgIGRlbGF5ID0gZGVsYXkgfHwgc3RlcC5kZWxheUJlZm9yZVN0ZXBTaG93O1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRDdXJyZW50U3RlcChzdGVwKSwgZGVsYXkpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBzaG93U3RlcChzdGVwOiBULCBza2lwQXN5bmMgPSBmYWxzZSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBhbmNob3IgPSB0aGlzLmFuY2hvcnNbc3RlcCAmJiBzdGVwLmFuY2hvcklkXTtcblxuICAgICAgICBpZiAoIWFuY2hvcikge1xuICAgICAgICAgICAgaWYgKHN0ZXAuaXNBc3luYyAmJiAhc2tpcEFzeW5jKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFuY2hvclJlZ2lzdGVyZWQkID0gdGhpcy5hbmNob3JSZWdpc3RlciRcbiAgICAgICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIoYW5jaG9ySWQgPT4gYW5jaG9ySWQgPT09IHN0ZXAuYW5jaG9ySWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3QoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5KDApXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5hc3luY1N0ZXBUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGFuY2hvclJlZ2lzdGVyZWQkID0gYW5jaG9yUmVnaXN0ZXJlZCRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoOiBzdGVwLmFzeW5jU3RlcFRpbWVvdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGg6ICgpID0+IG9mKG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYW5jaG9yUmVnaXN0ZXJlZCRcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHRoaXMuc2hvd1N0ZXAoc3RlcCwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RlcC5pc09wdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Gb3J3YXJkcyA/IHRoaXMubmV4dCgpIDogdGhpcy5wcmV2KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYENhbid0IGF0dGFjaCB0byB1bnJlZ2lzdGVyZWQgYW5jaG9yIHdpdGggaWQgXCIke3N0ZXAuYW5jaG9ySWR9XCJgKTtcbiAgICAgICAgICAgIHRoaXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saXN0ZW5Ub09uQW5jaG9yQ2xpY2soc3RlcCk7XG4gICAgICAgIHRoaXMud2FpdGluZ0ZvclNjcm9sbCA9IHRydWU7XG4gICAgICAgIGF3YWl0IHRoaXMuc2Nyb2xsVG9BbmNob3Ioc3RlcCk7XG4gICAgICAgIHRoaXMud2FpdGluZ0ZvclNjcm9sbCA9IGZhbHNlO1xuICAgICAgICBhbmNob3Iuc2hvd1RvdXJTdGVwKHN0ZXApO1xuICAgICAgICB0aGlzLnRvZ2dsZUJhY2tkcm9wKHN0ZXApO1xuICAgICAgICB0aGlzLnRvZ2dsZVBhZ2VTY3JvbGxpbmcoc3RlcCk7XG4gICAgICAgIHRoaXMuc3RlcFNob3ckLm5leHQoe1xuICAgICAgICAgICAgc3RlcCxcbiAgICAgICAgICAgIGRpcmVjdGlvbjogdGhpcy5kaXJlY3Rpb25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoaWRlU3RlcChzdGVwOiBUKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IHRoaXMuYW5jaG9yc1tzdGVwICYmIHN0ZXAuYW5jaG9ySWRdO1xuICAgICAgICBpZiAoIWFuY2hvcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGFuY2hvci5oaWRlVG91clN0ZXAoKTtcbiAgICAgICAgdGhpcy5zdGVwSGlkZSQubmV4dCh7XG4gICAgICAgICAgICBzdGVwLFxuICAgICAgICAgICAgZGlyZWN0aW9uOiB0aGlzLmRpcmVjdGlvblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNjcm9sbFRvQW5jaG9yKHN0ZXA6IFQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHN0ZXAuZGlzYWJsZVNjcm9sbFRvQW5jaG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbmNob3IgPSB0aGlzLmFuY2hvcnNbc3RlcD8uYW5jaG9ySWRdLFxuICAgICAgICAgICAgaHRtbEVsZW1lbnQgPSBhbmNob3IuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAgIHJldHVybiB0aGlzLnNjcm9sbGluZ1NlcnZpY2UuZW5zdXJlVmlzaWJsZShodG1sRWxlbWVudCwge1xuICAgICAgICAgICAgY2VudGVyOiBzdGVwLmNlbnRlckFuY2hvck9uU2Nyb2xsLFxuICAgICAgICAgICAgc21vb3RoU2Nyb2xsOiBzdGVwLnNtb290aFNjcm9sbCxcbiAgICAgICAgICAgIHNjcm9sbENvbnRhaW5lcjogc3RlcC5zY3JvbGxDb250YWluZXJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0b2dnbGVCYWNrZHJvcChzdGVwOiBUKSB7XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IHRoaXMuYW5jaG9yc1tzdGVwPy5hbmNob3JJZF07XG5cbiAgICAgICAgaWYgKHN0ZXAuZW5hYmxlQmFja2Ryb3ApIHtcbiAgICAgICAgICAgIHRoaXMuYmFja2Ryb3Auc2hvdyhhbmNob3IuZWxlbWVudCwgc3RlcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tkcm9wLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRvZ2dsZVBhZ2VTY3JvbGxpbmcoc3RlcDogVCkge1xuICAgICAgICBpZiAoc3RlcC5kaXNhYmxlUGFnZVNjcm9sbGluZykge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxCbG9ja2luZ1NlcnZpY2UuZW5hYmxlKHN0ZXAuc2Nyb2xsQ29udGFpbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQmxvY2tpbmdTZXJ2aWNlLmRpc2FibGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIl19