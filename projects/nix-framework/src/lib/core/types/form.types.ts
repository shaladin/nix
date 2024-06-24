import { QuestionBase, ValidateObject } from "..";
import { Endpoint } from "./template.types";

export type FormTemplate = {
    header: string;
    mode: 'add' | 'edit';
    questions: QuestionBase<any>[];
}

export type ActionType = 'callback' | 'setvalue' | 'required' | 'maxlength' | 'minlength' 
| 'http' | 'visible' | 'calculate' | 'effect';

export type BaseAction = {
    effect?: ValidateObject;
    subscriber: string[];
}

export type SetValueAction = {
    value: any;
} & BaseAction;

export type CallbackAction = {
    key: string;
}

export type RequiredLengthAction = {
    requiredLength: number;
} & BaseAction;

export type HttpAction = {
    endpoint: Endpoint;
    actions?: Action[];
}

export type CalculateAction = {
    formula: string;
    actions: Action[];
};

export type ActionResult = BaseAction | CallbackAction | SetValueAction | RequiredLengthAction 
| HttpAction | CalculateAction;

export type Action = {
    type: ActionType;
    condition?: ValidateObject
} & Partial<ActionResult>;