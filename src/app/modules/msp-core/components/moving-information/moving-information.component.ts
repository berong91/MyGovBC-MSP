import { Component, OnInit, forwardRef, EventEmitter, Input, Output } from '@angular/core';
import { Base, PROVINCE_LIST, BRITISH_COLUMBIA, COUNTRY_LIST, ErrorMessage, LabelReplacementTag } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { startOfToday, subMonths } from 'date-fns';


export interface IMovingInfo {

  isApplicant: boolean;
  isCanadianResident: boolean;
  isPermanentResident: boolean;
  isTemporaryResident: boolean;
  isLivingWithoutMSP: boolean;

  isProvinceMove: boolean;
  isCountryMove: boolean;
  livedInBCSinceBirth: boolean;
  madePermanentMoveToBC: boolean;

  arrivalToBCDate: Date;
  arrivalToCanadaDate: Date;
  movedFromProvinceOrCountry: string;
  healthNumberFromOtherProvince: string;
  hasPreviousBCPhn: boolean;
  previousBCPhn: string;

  outsideBCFor30Days: boolean;
  departureReason: string;
  departureDestination: string;
  oopDepartureDate: Date;
  oopReturnDate: Date;

  hasBeenReleasedFromArmedForces: boolean;
  dischargeDate: Date;
}

// TODO: Setup as generic so that account application can use it, add variables as optional
// do questions are display when variables are present
@Component({
  selector: 'msp-moving-information',
  templateUrl: './moving-information.component.html',
  styleUrls: ['./moving-information.component.scss'],

  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})
export class MovingInformationComponent<T extends IMovingInfo> extends Base implements OnInit {

  @Input() person: T;
  @Output() personChange: EventEmitter<T> = new EventEmitter<T>();

  // Web links
  links = environment.links;
  countryList = COUNTRY_LIST;
  // Remove BC from province list
  provinceList = PROVINCE_LIST.map( x => {
    if ( x.provinceCode !== BRITISH_COLUMBIA ) {
      return x;
    }
  }).filter( x => x );

  relationship: string = 'you';

  departureDateLabel = 'Departure date';
  returnDateLabel = 'Return date';
  today: Date = startOfToday();
  TwelveMonthsAgo: Date = subMonths( this.today, 12 );

  oopDepartureErrorMsg: ErrorMessage = {
    invalidRange: LabelReplacementTag + 'must be within the last 12 months and prior to return date.'
  };

  oopReturnErrorMsg: ErrorMessage = {
    invalidRange: LabelReplacementTag + 'must be within the last 12 months and prior to departure date.'
  };

  constructor() {
    super();
  }

  ngOnInit() {
    if ( !this.isApplicant ) {
      this.relationship = 'they';
    }
  }

  // Used in HTML - wrapper so when changes happen there is no impact to Automated tests for TEST Team
  get isApplicant() {
    return this.person.isApplicant;
  }

  // Used in HTML - wrapper so when changes happen there is no impact to Automated tests for TEST Team
  get isLivingWithoutMSP() {
    return this.person.isLivingWithoutMSP;
  }

  // Used in HTML - wrapper so when changes happen there is no impact to Automated tests for TEST Team
  get isTemporaryResident() {
    return this.person.isTemporaryResident;
  }

  get requestLivedInBC() {
    return this.person.isCanadianResident && this.isLivingWithoutMSP;
  }

  get requestPermMoveInfo() {
    //console.log( 'requestPermMoveInfo: ', this.person.livedInBCSinceBirth, this.requestLivedInBC );
    if ( this.requestLivedInBC ) {
      // Convert to boolean
      return this.person.livedInBCSinceBirth !== undefined && this.person.livedInBCSinceBirth !== null;
    }
    return this.person.isCanadianResident || this.person.isPermanentResident || this.isTemporaryResident;
  }

  get canContinueProcess() {

    //console.log( 'canContinueProcess: ', this.person.madePermanentMoveToBC );
    if ( this.person.madePermanentMoveToBC !== null &&
         this.person.madePermanentMoveToBC !== undefined ) {

      if ( this.requestLivedInBC ) {
        return this.person.livedInBCSinceBirth !== undefined &&
               this.person.livedInBCSinceBirth !== null &&
               this.person.madePermanentMoveToBC === true;
      }
      return this.person.madePermanentMoveToBC === true || this.isTemporaryResident;
    }
    return true;
  }

  get requestProvinceMoveInfo() {
    return (this.person.isCanadianResident && (this.person.isProvinceMove ||
           (this.isLivingWithoutMSP && this.person.livedInBCSinceBirth === false))) ||
           (this.person.isPermanentResident && this.person.isProvinceMove);
  }

  get requestCountryMoveInfo() {
    return (this.person.isCanadianResident || this.person.isPermanentResident) &&
            this.person.isCountryMove;
  }

  get requestArrivalInBCInfo() {
    return ((this.person.isCanadianResident || this.person.isPermanentResident) &&
           (this.person.isProvinceMove || this.person.isCountryMove)) || this.isTemporaryResident;
  }

  get arrivalDateRequired() {
    return (this.person.isCountryMove &&
           (this.person.isCanadianResident || this.person.isPermanentResident)) ||
           this.isTemporaryResident;
  }

  get requestProvHealthNumber() {
    return this.person.isProvinceMove &&
           (this.person.isCanadianResident || this.person.isPermanentResident);
  }

  get requestArmForceInfo() {
    return this.person.isCanadianResident ||
          (this.isApplicant && this.person.isPermanentResident);
  }

  get requestRecentMoveToBC() {
    //console.log( 'requestRecentMoveToBC ', this.requestLivedInBC, this.person.livedInBCSinceBirth );
    if ( this.requestLivedInBC ) {
      return this.person.livedInBCSinceBirth === false;
    }
    return true;
  }

  get requestArrivalToCanada() {
    //console.log( 'requestArrivalToCanada ', this.requestLivedInBC, this.person.livedInBCSinceBirth );
    if ( this.requestLivedInBC ) {
      return this.person.livedInBCSinceBirth === false;
    }
    return true;
  }

  get  oopDepartureStartRange() {
    return this.person.oopReturnDate ? this.person.oopReturnDate : this.TwelveMonthsAgo;
  }

  get  oopReturnStartRange() {
    return this.person.oopDepartureDate ? this.person.oopDepartureDate : this.TwelveMonthsAgo;
  }
}
