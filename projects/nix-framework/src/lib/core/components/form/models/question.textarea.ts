import { QuestionBase } from "./question.base";

export class TextareaQuestion extends QuestionBase<string> {
  override controlType = 'textarea';
  autoGrow: boolean = true;

  constructor(options: any = {}) {
    super(options);
    this.autoGrow = options['autoGrow'] === undefined ? true : options['autoGrow'];
    this.labelPlacement = options['labelPlacement'] || 'floating';
    this.fill = options['fill'] || 'solid';
  }
}