import {Component, Input} from '@angular/core'
import {Person, Gender} from "../../model/person.model";
import {Relationship, Activities, StatusInCanada} from "../../model/status-activities-documents";
import * as moment from 'moment';
require('./person-card.component.less');

@Component({
  selector: 'msp-person-card',
  templateUrl: './person-card.component.html'
})
export class MspPersonCardComponent {
  lang = require('./i18n');
  langStatus = require('../status/i18n');
  langActivities = require('../activities/i18n');
  langProvince = require('../province/i18n');

  @Input() person: Person;
  @Input() editRouterLink: string;

  get movedFromLabel():string {
    if (this.person.status == StatusInCanada.TemporaryResident ||
      this.person.currentActivity == Activities.MovingFromCountry) {
      return this.lang('./en/index.js').movedFromCountryLabel;
    }
    else {
      return this.lang('./en/index.js').movedFromProvinceLabel;
    }
  }
}
