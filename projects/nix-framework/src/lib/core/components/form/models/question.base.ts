import { FormControl } from "@angular/forms";
import { Action } from "../../../types/form.types";
import { DropdownQuestion } from "./question.dropdown";
import { RadioQuestion } from "./question.radio";
import { TextareaQuestion } from "./question.textarea";
import { TextboxQuestion } from "./question.textbox";

export class QuestionBase<T> {
    key: string;
    controlType: string;
    className?: string;
    value: T | undefined;
    label: string;
    placeholder?: string;
    required: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    locale?: string;
    max?: number | string;
    min?: number | string;
    order: number;
    type: string;
    fill: 'outline' | 'solid' | undefined;
    labelPlacement: 'floating' | 'stacked' | 'fixed' | 'end' | 'start';
    options: {key: string; value: string}[];
    actions?: Action[];
    isVisible?: boolean;
    children?: QuestionBase<any>[]; // Support nested group
    content?: string;
    format?: string;
    formControl?: FormControl;
    column?: {
      size?: string;
      sm?: string;
      md?: string;
      lg?: string;
    }
    [key: string]: any;
    
    constructor(
      options: {
        value?: T;
        key?: string;
        label?: string;
        placeholder?: string;
        required?: boolean;
        pattern?: string;
        minLength?: number;
        maxLength?: number;
        order?: number;
        controlType?: string;
        type?: string;
        options?: {key: string; value: string}[];
        actions?: Action[];
        isVisible?: boolean;
        fill?: 'outline' | 'solid' | undefined;
        labelPlacement?: any | undefined;
        children?: QuestionBase<any>[];
        content?: string;
        max?: number | string;
        min?: number | string;
        locale?: string;
        format?: string;
        column?: any;
        className?: string;
      } = {},
    ) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.placeholder = options.placeholder || '';
      this.required = !!options.required;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
      this.type = options.type || '';
      this.pattern = options?.pattern;
      this.minLength = options?.minLength;
      this.maxLength = options?.maxLength;
      this.options = options.options || [];
      this.actions = options.actions || [];
      this.isVisible = options.isVisible === undefined ? true : options.isVisible;
      this.fill = options.fill || 'solid';
      this.labelPlacement = options.labelPlacement || 'floating';
      this.children = options.children || [];
      this.content  = options.content;
      this.locale = options.locale || 'id';
      this.min = options.min;
      this.max = options.max;
      this.column = options.column;
      this.format = options.format;
      this.className = options.className || '';
    }
}

export type Question = QuestionBase<any> | TextboxQuestion | DropdownQuestion | RadioQuestion | TextareaQuestion;