import {Injectable} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { QuestionBase } from './models/question.base';
import { ControlType } from './enums';

@Injectable()
export class QuestionControlService {

  toFormGroup(questions: QuestionBase<any>[], group: Record<string, any> = {}) {
    questions.forEach((question) => {
      if (question.children && question.children.length > 0) {
        this.toFormControl(group, question);
        // group[question.key] = this.toFormGroup(question.children); // Recursive call for nested groups
      } else if (question.controlType !== ControlType.Container) {
        this.setFormControl(group, question);
      }
    });
    return new FormGroup(group);
  }

  private toFormControl(group: Record<string, any>, inputCtrl: QuestionBase<any>) {
    const children = inputCtrl.children || [];

    if (inputCtrl.key && children.length > 0) {
      group[inputCtrl.key] = this.toFormGroup(children);
      return;
    }

    for (const question of children) {
      this.setFormControl(group, question);
    }
  }

  private setFormControl(group: Record<string, any>, question: QuestionBase<any>) {
    const validations = this.getValidators(question);
    group[question.key] = new FormControl(question.value || '', validations); 
  }

  addControl(form: FormGroup, ctrl: QuestionBase<any>) {
    if (ctrl.children && ctrl.children.length > 0) {
      const nestedGroup = this.toFormGroup(ctrl.children);
      form.addControl(ctrl.key, nestedGroup);
    } else {
      const validations = this.getValidators(ctrl);
      form.addControl(ctrl.key, new FormControl(ctrl.value || '', validations));
    }
    form.updateValueAndValidity();
  }

  removeControl(form: FormGroup, ctrl: QuestionBase<any>) {
    form.removeControl(ctrl.key);
    form.updateValueAndValidity();
  }

  updateValidators(form: FormGroup, ctrl: QuestionBase<any>) {
    const validators = this.getValidators(ctrl);
    form.get(ctrl.key)?.clearValidators();
    form.get(ctrl.key)?.setValidators(validators);
    form.get(ctrl.key)?.updateValueAndValidity();
  }

  setValue(form: FormGroup, question: QuestionBase<any>) {
    form.get(question.key)?.setValue(question.value);
    form.updateValueAndValidity();
  }

  patchValue(form: FormGroup, values: {[key: string]: any}) {
    form.patchValue(values);
    form.updateValueAndValidity();
  }

  private getValidators(question: QuestionBase<any>) {
    const validations: ValidatorFn[] = [];

    if (question.required) {
      validations.push(Validators.required);
    }
    if (question.pattern) {
      validations.push(Validators.pattern(question.pattern));
    }
    if (question.minLength) {
      validations.push(Validators.minLength(question.minLength));
    }
    if (question.maxLength) {
      validations.push(Validators.maxLength(question.maxLength));
    }

    return validations;
  }
  
}