import { ActivatedRoute, Router } from '@angular/router';
import {Component, Injectable, ViewChild, ViewChildren,
  ChangeDetectorRef, QueryList, AfterViewInit, OnInit} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

// import {MspDataService} from '../../service/msp-data.service';
import { MspDataService } from '../../service/msp-data.service';
import {Relationship} from '../../model/status-activities-documents';
import {NgForm} from '@angular/forms';
import {BaseComponent} from '../../common/base.component';
import {ProcessService} from '../../service/process.service';
import { StatusInCanada} from '../../model/status-activities-documents';

@Component({
  selector: 'msp-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.scss']
})
export class ChildInfoComponent extends BaseComponent implements OnInit {
  static ProcessStepNum = 3;
  lang = require('./i18n');
  Relationship: typeof Relationship = Relationship;
  public buttonClass: string = 'btn btn-default';

  constructor (private dataService: MspDataService, private _router: Router, private _processService: ProcessService, private cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit() {
    this.initProcessMembers(ChildInfoComponent.ProcessStepNum, this._processService);
  }

  nextStep(){
    this._processService.setStep(3, true);
    this._router.navigate(['/msp/application/address']);
  
  }

  addChild(relationship: Relationship): void {
    this.dataService.getMspApplication().addChild(relationship);
  }

  get children(): Person[] {
    console.log(this.dataService.getMspApplication().children);
    return this.dataService.getMspApplication().children;
  }

  removeChild(event: Object, idx: number): void{
    // console.log('remove child ' + JSON.stringify(event));
    this.dataService.getMspApplication().removeChild(idx);
    this.dataService.saveMspApplication();

  }

  checkAnyDependentsIneligible(): boolean {
    const target = [...this.dataService.getMspApplication().children];
    return target.filter(x => x)
        .filter(x => x.ineligibleForMSP).length >= 1;
  }

  documentsReady(): boolean {
    return this.dataService.getMspApplication().childDocumentsReady;
  }  

}