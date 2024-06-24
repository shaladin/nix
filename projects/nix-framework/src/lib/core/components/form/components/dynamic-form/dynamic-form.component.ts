import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuestionControlService } from '../../question-control.service';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';
import { ValidationErrorService } from '../../validation-error.service';
import { Subscription } from 'rxjs';
import { QuestionBase } from '../../models';
import { Action, BaseAction, CalculateAction, CallbackAction, FormTemplate, HttpAction, SetValueAction } from '../../../../types';
import { evaluate } from '../../../../functions/evaluate';
import { calculate } from '../../../../functions/calculate';
import { getValue, transformObject, transformValue } from '../../../../functions/object.transformer';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../../../services';

@Component({
  selector: 'lib-dynamic-form',
  standalone: true,
  providers: [QuestionControlService, ValidationErrorService, HttpClient, HttpService],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, DynamicFormQuestionComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css'
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() template: FormTemplate | null   = null;
  @Input() dict: Record<string, any> = {};
  @Output() callback: EventEmitter<string> = new EventEmitter<string>();
  @Output() effect!: EventEmitter<{type: string, context: Record<string, any>, subject: string}>;
  
  payLoad = '';
  model?: any;
  form!: FormGroup;
  error$: Subscription | null = null;
  http$!: Subscription;
  formErrors: { [key: string]: string } = {};
  subscriber: EventEmitter<{type: string, subscriber: string[]}> = new EventEmitter<{type: string, subscriber: string[]}>();

  constructor(private qcs: QuestionControlService, private validationErrorService: ValidationErrorService, 
    private http: HttpService
  ) {
    this.effect = new EventEmitter<{type: string, context: Record<string, any>, subject: string}>();
  }

  ngOnDestroy(): void {
    if (this.error$) {
      this.error$.unsubscribe();
    }
  }

  ngOnInit() {
    if (!this.template) {
      return;
    }

    this.form = this.qcs.toFormGroup(this.template?.questions);
    this.error$  = this.form.valueChanges.subscribe(() => {
      this.model = this.form.getRawValue();
      this.updateFormErrors();
    });
  }

  onChange(key: string) {
    console.log('ion change: ', key);
    const question = this.template?.questions.find(x => x.key === key);

    if (!question) {
      throw new Error('Question not found.');
    }
    
    const actions = question.actions || [];
    this.publishEffect(key);
    this.execute(actions);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }

  publishEffect(key: string) {
    const context = {...this.dict, ...this.form.getRawValue()};
    this.effect.emit({
      type: 'effect',
      context: context,
      subject: key
    });
  }

  private execute(actions: Action[]) {
    const values  = {...this.form.value};
    for (let act of actions) {
      let validate = true;
      if (act.condition) {
        validate = evaluate(act.condition, values);
      }

      if (!validate) {
        continue;
      }

      this.actionHandler(act);
    }
  }

  private actionHandler(action: Action) {
    let effected: boolean;
    const values = {...this.form.value};

    switch (action.type) {
      case 'setvalue':
        const actValue = (action as SetValueAction);
        effected = actValue.effect === undefined ? true : evaluate(actValue.effect, values);

        for (let key of actValue.subscriber) {
          const question = this.template?.questions.find(x => x.key === key);
          if (!question) {
            continue;
          }

          let value = effected ? transformValue(actValue.value, this.dict) : question.value;
          if (typeof value  === 'object' && key in value) {
            value = getValue(key, value);
          }

          // question.value = value;
          this.form.get(key)?.setValue(value);
          this.form.updateValueAndValidity();
          this.onChange(key); // Notify value changes
        }
        break;
      case 'visible':
        const baseAct = action as BaseAction;
        const subscriber = baseAct.subscriber;

        if (baseAct.effect) {
          effected = evaluate(baseAct.effect, values);
        } else {
          effected = true;
        }

        for (let key of subscriber) {
          const question = this.template?.questions.find(x => x.key === key);
          if (!question) {
            continue;
          }
          
          question.isVisible = effected;
          if (effected) { // Add question to form group
            this.addControl(question);
          } else { // Remove question from form group due the question not visible in ui
            this.removeControl(question);
          }
        }
        break;
      case 'required':
        const mandatoryAct = action as BaseAction;
        if (mandatoryAct.effect) {
          effected = evaluate(mandatoryAct.effect, values);
        } else {
          effected = true;
        }

        for (let key of mandatoryAct.subscriber) {
          const question = this.template?.questions.find(x => x.key === key);
          if (!question) {
            continue;
          }
          
          question.required = effected;
          this.updateValidators(question);
        }
        break;
      case 'effect':
        const event = {
          type: 'effect',
          subscriber: (action as BaseAction).subscriber
        };
        this.subscriber.emit(event);
        break;
      case 'calculate':
        const formulaAction = action as CalculateAction;
        const value   = calculate(formulaAction.formula, values);
        const actions = formulaAction.actions as any[] || [];
        const acts = actions.map(act => ({
          type: act.type,
          condition: act.condition,
          value: transformValue(act.value, value),
          subscriber: act.subscriber || []  
        }));
        this.execute(acts);
        break;
      case 'http':
        this.executeHttp(action);
        break;
      case 'callback':
        const clbkAction = action as CallbackAction;
        this.callback.emit(clbkAction.key);
        break;
      default:
        console.log(`action type: ${action.type} not implemented!`);
        break;
    }
  }

  private executeHttp(action: Action) {
    const context  = {...this.dict, ...this.form.getRawValue()};
    const metadata = action as HttpAction;
    const endpoint = metadata.endpoint;
    const serviceUrl = endpoint.host + endpoint.path;
    const payload = transformObject(endpoint.params, context);
    const return$ = endpoint.return;
    this.http$ = this.http.post(serviceUrl, payload).subscribe({
      next: (response) => {
        this.dict[return$!.objectName] = response[return$!.objectName];
        const callback = return$?.actions || [];
        this.execute(callback);
      }, error: (err) => {
        throw err;
      }
    })
  }

  private removeControl(ctrl: QuestionBase<any>) {
    this.qcs.removeControl(this.form, ctrl)
  }

  private addControl(ctrl: QuestionBase<any>) {
    this.qcs.addControl(this.form, ctrl);
  }

  private updateValidators(ctrl: QuestionBase<any>) {
    this.qcs.updateValidators(this.form, ctrl);
  }

  private updateFormErrors() {
    this.formErrors = this.validationErrorService.getFormGroupErrors(this.form);
  }

}
