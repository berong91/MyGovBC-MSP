import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core'
import {Person} from "../../model/person.model";
import {NgForm} from "@angular/forms";
import {BaseComponent} from "../base.component";


@Component({
  selector: 'msp-name',
  templateUrl: './name.component.html'
})
export class MspNameComponent extends BaseComponent {
  lang = require('./i18n');

  @Input() person: Person;
  @Input() showError: boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;
  Person: typeof Person = Person;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.form.valueChanges.subscribe(
      (values) => {
        this.onChange.emit(values);
      }
    );
  }
}
