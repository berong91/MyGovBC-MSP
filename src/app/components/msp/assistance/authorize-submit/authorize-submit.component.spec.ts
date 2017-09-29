import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AssistanceAuthorizeSubmitComponent } from './authorize-submit.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
import {ThumbnailComponent} from "../../common/thumbnail/thumbnail.component";
import {Ng2BootstrapModule} from "ngx-bootstrap";
import {MspCancelComponent} from "../../common/cancel/cancel.component";
import {MspImageErrorModalComponent} from "../../common/image-error-modal/image-error-modal.component";
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import { MspLogService } from '../../service/log.service';
import { MspValidationService } from '../../service/msp-validation.service';
import appConstants from '../../../../services/appConstants';
import { CompletenessCheckService } from '../../service/completeness-check.service';
import { ProcessService } from "../../service/process.service";
import {RouterTestingModule} from "@angular/router/testing";
let CaptchaComponent = require("mygovbc-captcha-widget/component").CaptchaComponent;

describe('AssistanceAuthorizeSubmitComponent Test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceAuthorizeSubmitComponent, FileUploaderComponent, ThumbnailComponent, MspCancelComponent,
        MspImageErrorModalComponent,MspLoggerDirective, MspLoggerDirective, CaptchaComponent],
      imports: [FormsModule, Ng2BootstrapModule.forRoot(), HttpModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, MspLogService,CompletenessCheckService,MspValidationService,ProcessService,
        
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistanceAuthorizeSubmitComponent);
    expect(fixture.componentInstance instanceof AssistanceAuthorizeSubmitComponent).toBe(true, 'should create AssistanceAuthorizeSubmitComponent');

  });
})
