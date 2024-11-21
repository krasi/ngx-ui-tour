import * as i0 from '@angular/core';
import { inject, PLATFORM_ID, Injectable, RendererFactory2, Component, HostListener, afterNextRender, AfterRenderPhase, ElementRef, Directive } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { firstValueFrom, fromEvent, timeout, of, debounceTime, map, Subject, merge, filter, takeUntil, first, delay } from 'rxjs';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

function deepMerge(...objects) {
    return objects.reduce((acc, cur) => {
        cur ??= {};
        const keys = Object.keys(cur);
        for (const key of keys) {
            const accValue = acc[key], curValue = cur[key];
            if (isPlainObject(accValue) && isPlainObject(curValue)) {
                acc[key] = deepMerge(accValue, curValue);
            }
            else {
                acc[key] = curValue;
            }
        }
        return acc;
    }, {});
}
function isPlainObject(value) {
    return value instanceof Object && value.constructor === Object;
}

function isCovered(htmlElement, sidesToCheck = 2 /* ElementSides.All */) {
    const rect = htmlElement.getBoundingClientRect(), topEl = document.elementFromPoint(rect.left, rect.top), bottomEl = document.elementFromPoint(rect.right, rect.bottom), isTopCovered = !!topEl && topEl !== htmlElement && !areElementsRelated(topEl, htmlElement), isBottomCovered = !!bottomEl && bottomEl !== htmlElement && !areElementsRelated(bottomEl, htmlElement);
    if (sidesToCheck === 0 /* ElementSides.Top */) {
        return isTopCovered;
    }
    if (sidesToCheck === 1 /* ElementSides.Bottom */) {
        return isBottomCovered;
    }
    return isTopCovered || isBottomCovered;
}
function areElementsRelated(el1, el2) {
    return el1.contains(el2) || el2.contains(el1);
}

function isInViewport(htmlElement, sidesToCheck = 2 /* ElementSides.All */) {
    const viewportWidth = window.innerWidth, viewportHeight = window.innerHeight, boundingRectangle = htmlElement.getBoundingClientRect(), areCornersInViewport = boundingRectangle.left >= 0 && boundingRectangle.right <= viewportWidth, isTopInViewport = boundingRectangle.top >= 0, isBottomInViewport = boundingRectangle.bottom <= viewportHeight;
    if (sidesToCheck === 0 /* ElementSides.Top */) {
        return isTopInViewport && areCornersInViewport;
    }
    if (sidesToCheck === 1 /* ElementSides.Bottom */) {
        return isBottomInViewport && areCornersInViewport;
    }
    return isTopInViewport && isBottomInViewport && areCornersInViewport;
}

class OverflowUtils {
    static getVisibleSection(childRect, containerRect) {
        return OverflowUtils._isHeightOverflowing(childRect, containerRect) ?
            OverflowUtils._getOverlap(childRect, containerRect) :
            childRect;
    }
    static isHeightOverflowing(child, container) {
        return OverflowUtils._isHeightOverflowing(child instanceof HTMLElement ? child.getBoundingClientRect() : child, container instanceof HTMLElement ? container.getBoundingClientRect() : container);
    }
    static _isHeightOverflowing(childRect, containerRect) {
        return containerRect.height < childRect.height;
    }
    static _getOverlap(a, b) {
        const top = Math.max(a.top, b.top), left = Math.max(a.left, b.left), right = Math.min(a.right, b.right), bottom = Math.min(a.bottom, b.bottom);
        return new DOMRect(left, top, right - left, bottom - top);
    }
}

function getScrollableParent(node) {
    if (!(node instanceof HTMLElement || node instanceof ShadowRoot)) {
        return null;
    }
    const element = node instanceof ShadowRoot ? node.host : node;
    const style = getComputedStyle(element), isScrollable = element.scrollHeight > element.clientHeight, overflow = style.overflowY, scrollableOverflow = ['scroll', 'auto'];
    if (isScrollable && scrollableOverflow.includes(overflow)) {
        return element;
    }
    return getScrollableParent(element.parentNode);
}

class ScrollUtils {
    static getScrollContainer(anchorEl, userScrollContainer) {
        if (typeof userScrollContainer === 'string') {
            return document.documentElement.querySelector(userScrollContainer);
        }
        if (userScrollContainer instanceof HTMLElement) {
            return userScrollContainer;
        }
        return getScrollableParent(anchorEl);
    }
}

class ScrollingService {
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

class TourResizeObserverService {
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

class TourBackdropService {
    constructor() {
        this.isSpotlightClosed = false;
        this.rendererFactory = inject(RendererFactory2);
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.resizeObserverService = inject(TourResizeObserverService);
        this.scrollingService = inject(ScrollingService);
        this.document = inject(DOCUMENT);
    }
    show(targetElement, step) {
        if (this.targetHtmlElement) {
            this.resizeObserverService.unobserveElement(this.targetHtmlElement);
        }
        this.targetHtmlElement = targetElement.nativeElement;
        this.step = step;
        this.resizeObserverService.observeElement(this.targetHtmlElement);
        if (!this.backdropElements) {
            this.backdropElements = this.createBackdropElements();
            this.subscribeToResizeEvents();
        }
        this.isSpotlightClosed = false;
        this.setBackdropPosition();
    }
    closeSpotlight() {
        if (!this.backdropElements) {
            return;
        }
        const targetRect = this.targetHtmlElement.getBoundingClientRect(), centerX = targetRect.left + (targetRect.width / 2), centerY = targetRect.top + (targetRect.height / 2), centerRect = {
            top: centerY,
            right: centerX,
            bottom: centerY,
            left: centerX,
            width: 0,
            height: 0
        };
        this.isSpotlightClosed = true;
        this.setBackdropPosition(centerRect);
    }
    setBackdropPosition(rectangle = null) {
        const docEl = this.document.documentElement, scrollContainer = ScrollUtils.getScrollContainer(this.targetHtmlElement, this.step.scrollContainer) ?? docEl, elementBoundingRect = rectangle ?? this.targetHtmlElement.getBoundingClientRect(), scrollContainerRect = scrollContainer.getBoundingClientRect(), visibleSection = OverflowUtils.getVisibleSection(elementBoundingRect, scrollContainerRect), scrollHeight = docEl.scrollHeight, scrollWidth = docEl.scrollWidth, window = this.document.defaultView, scrollX = window.scrollX, scrollY = window.scrollY, offset = this.isSpotlightClosed ? 0 : this.step.backdropConfig?.offset ?? 0, leftRect = {
            width: visibleSection.left + scrollX - offset,
            height: scrollHeight,
            top: 0,
            left: 0
        }, topRect = {
            width: visibleSection.width + offset * 2,
            height: visibleSection.top + scrollY - offset,
            top: 0,
            left: visibleSection.left + scrollX - offset
        }, bottomRect = {
            width: visibleSection.width + offset * 2,
            height: scrollHeight - (visibleSection.bottom + scrollY) - offset,
            top: visibleSection.bottom + scrollY + offset,
            left: visibleSection.left + scrollX - offset
        }, rightRect = {
            width: scrollWidth - (visibleSection.right + scrollX) - offset,
            height: scrollHeight,
            top: 0,
            left: visibleSection.right + scrollX + offset
        }, rectangles = [leftRect, topRect, bottomRect, rightRect];
        for (let i = 0; i < rectangles.length; i++) {
            const styles = this.createBackdropStyles(rectangles[i]);
            this.applyStyles(styles, this.backdropElements[i]);
        }
    }
    subscribeToResizeEvents() {
        this.resizeSubscription = this.resizeObserverService.resize$
            .subscribe(() => {
            this.setBackdropPosition();
            if (!this.step.disableScrollToAnchor) {
                this.scrollingService.ensureVisible(this.targetHtmlElement, {
                    center: this.step.centerAnchorOnScroll,
                    smoothScroll: false
                });
            }
        });
    }
    close() {
        if (this.backdropElements) {
            this.resizeObserverService.unobserveElement(this.targetHtmlElement);
            this.removeBackdropElement();
            this.resizeSubscription.unsubscribe();
        }
    }
    disconnectResizeObserver() {
        this.resizeObserverService.disconnect();
    }
    removeBackdropElement() {
        this.backdropElements.forEach(backdropElement => this.renderer.removeChild(this.parentContainer, backdropElement));
        this.backdropElements = undefined;
    }
    applyStyles(styles, element) {
        for (const name of Object.keys(styles)) {
            this.renderer.setStyle(element, name, styles[name]);
        }
    }
    createBackdropStyles(rectangle) {
        const config = this.step.backdropConfig, normalizedRect = {
            ...rectangle,
            width: Math.max(rectangle.width, 0),
            height: Math.max(rectangle.height, 0)
        };
        return {
            position: 'absolute',
            width: `${normalizedRect.width}px`,
            height: `${normalizedRect.height}px`,
            top: `${normalizedRect.top}px`,
            left: `${normalizedRect.left}px`,
            backgroundColor: config?.backgroundColor ?? 'rgba(0, 0, 0, 0.7)',
            zIndex: config?.zIndex ?? '101'
        };
    }
    createBackdropElement() {
        const backdropElement = this.renderer.createElement('div');
        this.renderer.addClass(backdropElement, 'ngx-ui-tour_backdrop');
        this.renderer.appendChild(this.parentContainer, backdropElement);
        return backdropElement;
    }
    createBackdropElements() {
        return Array
            .from({ length: 4 })
            .map(() => this.createBackdropElement());
    }
    get parentContainer() {
        const parent = this.step.backdropConfig?.parentContainer;
        if (parent instanceof HTMLElement) {
            return parent;
        }
        if (typeof parent === 'string') {
            const queryResult = this.document.documentElement.querySelector(parent);
            return queryResult ?? this.document.body;
        }
        return this.document.body;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourBackdropService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourBackdropService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourBackdropService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class AnchorClickService {
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

class ScrollBlockingService {
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

var TourState;
(function (TourState) {
    TourState[TourState["OFF"] = 0] = "OFF";
    TourState[TourState["ON"] = 1] = "ON";
    TourState[TourState["PAUSED"] = 2] = "PAUSED";
})(TourState || (TourState = {}));
var Direction;
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
class TourService {
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
        this.events$ = merge(this.stepShow$.pipe(map(value => ({ name: 'stepShow', value }))), this.stepHide$.pipe(map(value => ({ name: 'stepHide', value }))), this.initialize$.pipe(map(value => ({ name: 'initialize', value }))), this.start$.pipe(map(value => ({ name: 'start', value }))), this.end$.pipe(map(value => ({ name: 'end', value }))), this.pause$.pipe(map(value => ({ name: 'pause', value }))), this.resume$.pipe(map(value => ({ name: 'resume', value }))), this.anchorRegister$.pipe(map(value => ({
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

class TourHotkeyListenerComponent {
    constructor(tourService) {
        this.tourService = tourService;
    }
    /**
     * Configures hot keys for controlling the tour with the keyboard
     */
    onEscapeKey() {
        if (this.tourService.getStatus() === TourState.ON &&
            this.tourService.isHotkeysEnabled()) {
            this.tourService.end();
        }
    }
    onArrowRightKey() {
        const step = this.tourService.currentStep;
        if (this.tourService.getStatus() === TourState.ON &&
            this.tourService.hasNext(this.tourService.currentStep) &&
            this.tourService.isHotkeysEnabled() &&
            !step?.nextOnAnchorClick) {
            this.tourService.next();
        }
    }
    onArrowLeftKey() {
        if (this.tourService.getStatus() === TourState.ON &&
            this.tourService.hasPrev(this.tourService.currentStep) &&
            this.tourService.isHotkeysEnabled()) {
            this.tourService.prev();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourHotkeyListenerComponent, deps: [{ token: TourService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.12", type: TourHotkeyListenerComponent, isStandalone: true, selector: "tour-hotkey-listener", host: { listeners: { "window:keydown.Escape": "onEscapeKey()", "window:keydown.ArrowRight": "onArrowRightKey()", "window:keydown.ArrowLeft": "onArrowLeftKey()" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: TourHotkeyListenerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'tour-hotkey-listener',
                    template: `<ng-content></ng-content>`,
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: TourService }], propDecorators: { onEscapeKey: [{
                type: HostListener,
                args: ['window:keydown.Escape']
            }], onArrowRightKey: [{
                type: HostListener,
                args: ['window:keydown.ArrowRight']
            }], onArrowLeftKey: [{
                type: HostListener,
                args: ['window:keydown.ArrowLeft']
            }] } });

class BaseTourProxyAnchor {
    constructor() {
        this.document = inject(DOCUMENT);
        afterNextRender(() => this.setAnchorElement(), {
            phase: AfterRenderPhase.Read
        });
    }
    setAnchorElement() {
        if (this.anchorEl instanceof HTMLElement) {
            this.anchorDirective.element = new ElementRef(this.anchorEl);
            return;
        }
        const htmlElement = this.document.querySelector(this.anchorEl);
        if (!htmlElement) {
            throw new Error(`Element with "${this.anchorEl}" CSS selector could not be found!`);
        }
        this.anchorDirective.element = new ElementRef(htmlElement);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: BaseTourProxyAnchor, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.12", type: BaseTourProxyAnchor, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12", ngImport: i0, type: BaseTourProxyAnchor, decorators: [{
            type: Directive
        }], ctorParameters: () => [] });

/**
 * Generated bundle index. Do not edit.
 */

export { BaseTourProxyAnchor, Direction, TourHotkeyListenerComponent, TourService, TourState, isCovered, isInViewport };
//# sourceMappingURL=ngx-ui-tour-core.mjs.map
