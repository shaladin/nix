import { Subscription } from "rxjs";
import { Template } from "../types";

export abstract class BaseComponent {

    data: any;
    template: Template = null;
    dict: Record<string, any> = {};
    subscription: Subscription | null = null;
    isLoading: boolean = true;
    hasError: boolean = false;
    errorMessage: string = '';

    abstract getData(): void;
    abstract retry(): void;
}