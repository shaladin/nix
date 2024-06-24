import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationErrorService {

  private validationMessages: any = {
    required: 'This field is required',
    pattern: 'Invalid format',
    minlength: (params: any) => `Minimum length is ${params.requiredLength} characters`,
    maxlength: (params: any) => `Maximum length is ${params.requiredLength} characters`,
    email: 'Invalid email address'
  };

  getErrorMessage(control: FormControl): string {
    for (const errorKey in control.errors) {
      if (control.errors.hasOwnProperty(errorKey)) {
        if (typeof this.validationMessages[errorKey] === 'function') {
          return this.validationMessages[errorKey](control.errors[errorKey]);
        } else {
          return this.validationMessages[errorKey];
        }
      }
    }
    return '';
  }

  getFormGroupErrors(formGroup: FormGroup): { [key: string]: string } {
    const errors: { [key: string]: string } = {};
    Object.keys(formGroup.controls).forEach(key => {
      const controlErrors = formGroup.get(key)?.errors;
      if (controlErrors) {
        errors[key] = this.getErrorMessage(formGroup.get(key) as FormControl);
      }
    });
    return errors;
  }
}
