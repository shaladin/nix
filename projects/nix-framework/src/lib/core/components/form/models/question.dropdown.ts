import { FetchData } from "../../../types/template.types";
import { QuestionBase } from "./question.base";

export class DropdownQuestion extends QuestionBase<string> {
  override controlType  = 'dropdown';
  fetchData?: FetchData = undefined;

  constructor(options: any = {}) {
    super(options);
    this.fetchData = options['fetchData'];
  }
}