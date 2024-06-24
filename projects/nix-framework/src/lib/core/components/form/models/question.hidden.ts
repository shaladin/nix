import { QuestionBase } from "./question.base";

export class HiddenQuestion extends QuestionBase<string> {
    override controlType: string = 'hidden';
}