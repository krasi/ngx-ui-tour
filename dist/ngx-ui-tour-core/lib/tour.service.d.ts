import type { UrlSegment } from '@angular/router';
import { TourAnchorDirective } from './tour-anchor.directive';
import { Observable, Subject } from 'rxjs';
import { BackdropConfig } from './tour-backdrop.service';
import * as i0 from "@angular/core";
export interface StepDimensions {
    width?: string;
    minWidth?: string;
    maxWidth?: string;
}
export interface IStepOption {
    stepId?: string;
    anchorId?: string;
    title?: string;
    content?: string;
    route?: string | UrlSegment[];
    nextStep?: number | string;
    prevStep?: number | string;
    disableScrollToAnchor?: boolean;
    centerAnchorOnScroll?: boolean;
    smoothScroll?: boolean;
    /**
     * CSS selector or html element reference. Only set this config if you have enabled "smoothScroll" and tour step
     * description pops-up before scrolling has finished or doesn't show up at all. This should only be the case when
     * scroll container is part of shadow DOM.
     */
    scrollContainer?: string | HTMLElement;
    prevBtnTitle?: string;
    nextBtnTitle?: string;
    endBtnTitle?: string;
    enableBackdrop?: boolean;
    backdropConfig?: BackdropConfig;
    isAsync?: boolean;
    asyncStepTimeout?: number;
    isOptional?: boolean;
    delayAfterNavigation?: number;
    delayBeforeStepShow?: number;
    nextOnAnchorClick?: boolean;
    duplicateAnchorHandling?: 'error' | 'registerFirst' | 'registerLast';
    disablePageScrolling?: boolean;
    allowUserInitiatedNavigation?: boolean;
    stepDimensions?: StepDimensions;
    popoverClass?: string;
    showProgress?: boolean;
}
export declare enum TourState {
    OFF = 0,
    ON = 1,
    PAUSED = 2
}
export declare enum Direction {
    Forwards = 0,
    Backwards = 1
}
export interface StepChangeParams<T extends IStepOption = IStepOption> {
    step: T;
    direction: Direction;
}
export declare class TourService<T extends IStepOption = IStepOption> {
    stepShow$: Subject<StepChangeParams<T>>;
    stepHide$: Subject<StepChangeParams<T>>;
    initialize$: Subject<T[]>;
    start$: Subject<void>;
    end$: Subject<void>;
    pause$: Subject<void>;
    resume$: Subject<void>;
    anchorRegister$: Subject<string>;
    anchorUnregister$: Subject<string>;
    events$: Observable<{
        name: string;
        value: unknown;
    }>;
    steps: T[];
    currentStep: T;
    anchors: {
        [anchorId: string]: TourAnchorDirective;
    };
    private status;
    private isHotKeysEnabled;
    private direction;
    private waitingForScroll;
    private navigationStarted;
    private userDefaults;
    private readonly router;
    private readonly backdrop;
    private readonly anchorClickService;
    private readonly scrollBlockingService;
    private readonly scrollingService;
    initialize(steps: T[], stepDefaults?: T): void;
    setDefaults(defaultOptions: T): void;
    getDefaults(): T;
    private validateSteps;
    private subscribeToNavigationStartEvent;
    disableHotkeys(): void;
    enableHotkeys(): void;
    start(): void;
    startAt(stepId: number | string): void;
    end(): void;
    pause(): void;
    private disableTour;
    resume(): void;
    toggle(pause?: boolean): void;
    next(): void;
    private getStepIndex;
    hasNext(step: T): boolean;
    private isNextOptionalAnchorMissing;
    prev(): void;
    hasPrev(step: T): boolean;
    private isPrevOptionalAnchorMising;
    goto(stepId: number | string): void;
    register(anchorId: string, anchor: TourAnchorDirective): void;
    private findStepByAnchorId;
    unregister(anchorId: string): void;
    getStatus(): TourState;
    isHotkeysEnabled(): boolean;
    private goToStep;
    private listenToOnAnchorClick;
    private navigateToRouteAndSetStep;
    private loadStep;
    private setCurrentStep;
    private setCurrentStepAsync;
    protected showStep(step: T, skipAsync?: boolean): Promise<void>;
    private hideStep;
    private scrollToAnchor;
    private toggleBackdrop;
    private togglePageScrolling;
    static ɵfac: i0.ɵɵFactoryDeclaration<TourService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TourService<any>>;
}
