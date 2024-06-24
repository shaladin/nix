import { QuestionBase } from "./question.base";

export class ContainerQuestion extends QuestionBase<string> {
    override controlType: string = 'container';
}