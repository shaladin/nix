import { QuestionBase } from "./question.base";

export class AddressQuestion extends QuestionBase<any> {
    override controlType: string = 'addresses';

    constructor(options: any = {}) {
        super(options);
    }
}