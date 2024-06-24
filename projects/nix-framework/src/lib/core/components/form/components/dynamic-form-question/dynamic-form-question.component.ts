import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonDatetime, IonicModule } from '@ionic/angular';
import { DropdownQuestion, Question, QuestionBase, RadioQuestion, TextareaQuestion } from '../../models';
import { BaseComponent } from '../../../base.component';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../../../services';
import { Endpoint, FetchData, FetchDataHttp, FetchDataRef } from '../../../../types';
import { transformObject } from '../../../../functions/object.transformer';
import { Subscription } from 'rxjs';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import dateMask from '../../masks/date.mask';
import currencyMask from '../../masks/currency.mask';
import percentMask from '../../masks/percent.mask';
import { provideNgxMask } from 'ngx-mask';
import { IonMaskDirective } from '../../directives/ion-mask.directive';
import { ControlType } from '../../enums';
import { format, parseISO } from 'date-fns';
import { QuestionControlService } from '../../question-control.service';
import { ValidationErrorService } from '../../validation-error.service';

@Component({
  selector: 'lib-dynamic-question',
  standalone: true,
  providers: [HttpClient, HttpService, provideNgxMask({validation: false, thousandSeparator: '.'})],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, MaskitoDirective, IonMaskDirective],
  templateUrl: './dynamic-form-question.component.html',
  styleUrl: './dynamic-form-question.component.css'
})
export class DynamicFormQuestionComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @Input({required: true}) question!: QuestionBase<any> | any;
  @Input() subscriber: EventEmitter<{type: string, subscriber: string[]}> = new EventEmitter<any>();
  @Input() form: FormGroup = this.fb.group({});
  @Input() errors: { [key: string]: string }  = {};
  @Input() override dict: Record<string, any> = {};
  // @Input() notify

  @Output()
  onChange: EventEmitter<string> = new EventEmitter<string>();

  subscriber$!: Subscription;
  dateMask!: Required<MaskitoOptions>;
  currencyMask!: Required<MaskitoOptions>;
  percentageMask!: MaskitoOptions;

  readonly maskPredicate: MaskitoElementPredicate = (el) => (el as HTMLIonInputElement).getInputElement();

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }

  get alertMessage(): string {
    return this.validationErrorMsg
      .getErrorMessage(this.formControl as FormControl);
  }

  get childGroup() {
    if (this.question.controlType === ControlType.Group && !this.question.key) {
      return this.form;
    }

    return this.form.get(this.question.key) as FormGroup;
  }

  get formControl() {
    return this.form.get(this.question.key);
  }

  constructor(private http: HttpService, private fb: FormBuilder, private qcs: QuestionControlService, 
    private validationErrorMsg: ValidationErrorService) {
    super();
  }

  ngAfterViewInit(): void {
    this.subscriber$ = this.subscriber.subscribe(event => {
      if (event.type !== 'effect') return;

       // Check if the event subscriber includes the question key
       const isSubscriberMatched = event.subscriber.includes(this.question.key);
       if (isSubscriberMatched) {
         if (this.question.controlType !== ControlType.Textbox && this.question.controlType !== ControlType.Textarea) { // todo: code optimization
           this.reset();
         }

         this.getData();
         this.ionChange(this.question.key);
       }
    }, err => console.error('Error: ', err));
  }

  ngOnInit(): void {
    this.initializeInputMask();
    this.getData();
    this.question.formControl = this.formControl;

    const actions: any[] = this.question.actions || [];
    if (actions.some(act => act.type === 'calculate')) {
      return;
    }
    this.ionChange(this.question.key);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.subscriber$) {
      this.subscriber$.unsubscribe();
    }
  }

  initializeInputMask() {
    switch (this.question.controlType) {
      case ControlType.Datetime:
        this.dateMask = dateMask({
          format: this.question.format,
          separator: '/',
          min: this.question.min,
          max: this.question.max
        });
        break;
      case ControlType.Currency:
        this.currencyMask = currencyMask;
        break;
      case ControlType.Percent:
        this.percentageMask = percentMask;
        break;
      default:
        break;
    }
  }

  // Notify parent on input change
  // Todo: need to check compatibility for child question
  ionChange(key: string) {
    if (!this.question.actions || this.question.actions.length === 0) {
      return;
    }

    this.onChange.emit(key);
  }

  ionDateAction(role: string, datetime: IonDatetime) {
    if (role === 'today') {
      const today = new Date();
      datetime.value = today.toISOString();
      datetime.confirm(true);
    } else {
      datetime.confirm(true);
    }
  }

  setDate($event: any) {
    if (!$event.detail.value) return;
    const value = format(parseISO($event.detail.value), this.question?.format);
    this.question.value = value;
    this.qcs.setValue(this.form, this.question);
    this.ionChange(this.question.key);
    console.log('Set Datetime: ', $event);
  }

  get hasOptionsAnswer() {
    return this.question.options && this.question.options.length > 0;
  }

  override getData(): void {
    // Escape if question not have fetchData object
    const ctrl = this.question as any;
    if (!ctrl['fetchData']) {
      setTimeout(() => this.isLoading = false, 150);
      return;
    }

    this.isLoading = true;
    const context  = {...this.dict, ...this.form.value};
    const fetchData: FetchData = (this.question as DropdownQuestion).fetchData as any;
    if (fetchData.type === 'http') {
      const endpoint: Endpoint = (fetchData as FetchDataHttp).endpoint;
      const serviceUrl  = endpoint.environment + endpoint.path;
      const payload     = transformObject(endpoint.params, context);
      this.subscription = this.http.post(serviceUrl, payload).subscribe({
        next: (response) => {
          // Update options data to dictionary as cached data
          const options: Record<string, any> = {};
          options[this.question.key] = response;
          Object.assign(this.dict, {options: options});
          this.question.options = response['Data'];
        }, error: (error) => {
          console.log('failed to fetch options data', error);
          this.hasError = true;
        }, complete: () => this.isLoading = false
      })
    } else {
      const fetchDataRef: FetchDataRef = fetchData as FetchDataRef;
      setTimeout(() => this.isLoading = false, 1000);
    }
  }

  override retry(): void {
    this.getData();
  }

  private reset() {
    // Reset the question value
    this.form.get(this.question.key)?.reset();
  }

}
