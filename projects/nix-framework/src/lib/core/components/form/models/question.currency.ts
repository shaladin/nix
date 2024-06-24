import { QuestionBase } from "./question.base";

export class CurrencyQuestion extends QuestionBase<string> {
    override controlType: string = 'currency';
}