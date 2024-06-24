import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nix-form-container',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DynamicFormComponent],
  templateUrl: './form-container.component.html',
  styleUrl: './form-container.component.css'
})
export class FormContainerComponent implements OnInit, OnDestroy {
  @Input() showDefaultButtons: boolean = false;
  @Input() debug: boolean = false;

  @Output()
  submit: EventEmitter<any> = new EventEmitter<any>();

  protected form!: FormGroup;
  values!: {[key: string]: any};
  value$!: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({});
    this.values = {};

    this.value$ = this.form.valueChanges.subscribe(value => this.values = value);
  }

  ngOnDestroy(): void {
    if (this.value$) {
      this.value$.unsubscribe();
    }

    this.form = this.fb.group({});
    this.values = {};
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.submit.emit({form: this.form, data: this.form.getRawValue()});
  }
  
}
