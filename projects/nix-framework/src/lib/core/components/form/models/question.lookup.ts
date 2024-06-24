import { ControlType } from "../enums";
import { QuestionBase } from "./question.base";

export class LookupQuestion extends QuestionBase<string> {
    override controlType: string = ControlType.Lookup;
}