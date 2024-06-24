import { QuestionBase } from "./question.base";

export class QuestionGroup extends QuestionBase<string> {
    override controlType: string = 'group';
    expandable?: boolean;

    constructor(options: any = {}) {
        super(options);
        this.expandable = options?.expandable === undefined ? true : options.expandable;
    }
}