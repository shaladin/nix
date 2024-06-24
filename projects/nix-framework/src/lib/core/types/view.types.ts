import { BaseTemplate, ComponentData } from "./template.types";

export type ViewTemplate = {
    type: 'tabs' | 'default';
    scrollable?: boolean;
    component: ComponentData[]
} & Partial<BaseTemplate>;