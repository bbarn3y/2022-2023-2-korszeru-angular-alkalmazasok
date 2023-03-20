import { Injectable } from '@angular/core';
import {AbstractControl, FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  nonNullValidator() {
    return (control: AbstractControl): { [k: string]: any } | null => {
      if (control.value === null) {
        return {
          isNull: true
        }
      } else {
        return null;
      }
    }
  }

  nameConditionallyRequired() {
    return (group: AbstractControl): { [k: string]: any } | null => {
      const name = group.get('name')?.value;
      const status = group.get('status')?.value;
      console.log(name, status);
      if (status === true && (!name || name === '')) {
        console.log('nameRequired error');
        return {
          nameRequired: true
        }
      } else {
        return null;
      }
    }
  }
}
