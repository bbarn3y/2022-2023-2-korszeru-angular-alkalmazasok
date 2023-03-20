import { Injectable } from '@angular/core';
import {AbstractControl, FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() {}

  nonNullValidator() {
    console.log('nonNullValidator');
    return (control: AbstractControl): { [key: string]: any } | null => {
      console.log(control, control.value)
      if (control.value === null) {
        console.log('isNUll');
        return {
          isNull: true
        }
      }
      return null;
    }
  }

  statusNameValidator() {
    console.log('statusNameValidator');
    return (group: FormGroup): { [key: string]: any } | null => {
      const name = group.get('name')?.value;
      const status = group.get('status')?.value;
      console.log(name, status)
      if (status && !name) {
        console.log('missing name')
        return {
          missingName: true
        }
      }
      return null;
    }
}


}
