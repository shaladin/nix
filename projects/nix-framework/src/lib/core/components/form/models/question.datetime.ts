import { QuestionBase } from "./question.base";

export class DatetimeQuestion extends QuestionBase<any> {
    override controlType: string = 'datetime';
    
    constructor(options: any = {}) {
        super(options);
        this.type  = options['type'] || 'date';
        this.format = options['format'] || 'dd/MM/yyyy';
        this.placeholder = options['placeholder'] || this.format;
    }
}