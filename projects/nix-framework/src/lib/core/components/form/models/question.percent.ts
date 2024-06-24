import { QuestionBase } from "./question.base";

export class PercentageQuestion extends QuestionBase<string> {
    override controlType: string = 'percentage';
}