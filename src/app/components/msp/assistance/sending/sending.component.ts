import {Component, Inject, Injectable, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import { MspDataService } from '../../service/msp-data.service';
import {MspApiService} from "../../service/msp-api.service";
import {Router} from "@angular/router";
import {ResponseType} from "../../api-model/responseTypes";
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";
import {MspLogService} from '../../service/log.service'

@Component({
  templateUrl: 'sending.component.html'
})
@Injectable()
export class AssistanceSendingComponent implements AfterContentInit  {
  lang = require('./i18n');

  application:FinancialAssistApplication;
  rawUrl: string;
  rawError: string;
  rawRequest: string;

  transmissionInProcess:boolean;
  hasError:boolean;
  showMoreErrorDetails:boolean;

  constructor(private dataService: MspDataService, 
              private service:MspApiService, 
              public router: Router,
              public logService:MspLogService) {
    this.application = this.dataService.finAssistApp;
  }

  ngAfterContentInit() {
    // After view inits, begin sending the application
    this.transmissionInProcess = true;
    this.hasError = false;
    
    // After view inits, begin sending the application
    this.service
      .sendApplication(this.application)
      .then((application:FinancialAssistApplication) => {
        this.application = application;

        this.logService.log({name: 'premium assistance application received success confirmation from API server', 
          confirmationNumber: this.application.referenceNumber});

        //delete the premium assistance application content from local storage
        this.dataService.removeFinAssistApplication();

        //  go to confirmation
        this.router.navigate(["/msp/assistance/confirmation"], 
          {queryParams: {confirmationNum:this.application.referenceNumber}});
        
      })
      .catch((error: ResponseType | any) => {
        console.log('Error in sending PA: %o', error);
        this.hasError = true;
        
        this.rawUrl = error.url;
        this.rawError = error;
        this.rawRequest = error._requestBody;

        this.logService.log({name: 'premium assistance application received failure message from API server', 
          error: error._body,
          request: error._requestBody});
        this.transmissionInProcess = false;
        // this.router.navigate(["/msp/assistance/confirmation"]);
        this.application.authorizationToken = null;
      });
  }

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }
  
  retrySubmission(){
    this.router.navigate(['/msp/assistance/authorize-submit']);
  }
  
}