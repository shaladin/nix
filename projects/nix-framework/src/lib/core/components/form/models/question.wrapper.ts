import { ControlType } from "../enums"
import { QuestionBase } from "./question.base"

export class WrapperQuestion extends QuestionBase<string> {
    override controlType: string = ControlType.Wrapper;
    fields?: QuestionBase<string>[];

}