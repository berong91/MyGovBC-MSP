import { ContainerService, AbstractForm, PageStateService } from 'moh-common-lib';
import { Router, NavigationStart, NavigationEnd, ActivationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {ProcessService} from '../../../services/process.service';
import { browser } from 'protractor';

export let browserRefresh = false;

export class BaseForm extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

  private _subscription: Subscription;
  private linkedProcessStepNumber: number;
  private subscription: Subscription;

  constructor( protected router: Router,
               protected containerService: ContainerService,
               protected pageStateService: PageStateService,
               protected _processService: ProcessService ) {
    super(router);
    this.subscription = router.events.subscribe((event) => {
      console.log('EVENT:' + event);
      if (event instanceof NavigationStart) {
        browserRefresh = true;
        console.log('NAVIGATION START:' + browserRefresh);
      }
      // if (event instanceof ActivationEnd) {
      //   browserRefresh = !router.navigated;
      //   console.log('ACTIVATION END:' + browserRefresh);
      // }
    });
  }

  ngOnInit() {
    // Default behaviour for most pages - override if need different functionality
    // this.containerService.setSubmitLabel();
    // this.containerService.setUseDefaultColor();

    // Set page incomplete
    // this.pageStateService.setPageIncomplete();

    console.log(browserRefresh);

    if (browserRefresh){
      location.assign('/msp');
    }

  }

  ngAfterViewInit() {
    this._subscription = this.containerService.$continueBtn.subscribe(
      (obs) => {
        this.continue();
    });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  isSet(val) {
    return val !== undefined && val !== null;
  }

  initProcessMembers(processStepNum: number, newProcessService: ProcessService){
    this.linkedProcessStepNumber = processStepNum;
    this._processService = newProcessService;
  }

  continue() {
    // console.log( 'Continue: base form to be overriden');
  }

  protected navigate( url: string ) {
    // Set page complete before navigating to next URL
    this.pageStateService.setPageComplete();
    super.navigate(url);
  }
}
