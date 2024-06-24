import { ValidateObject } from "..";
import { Action } from "./form.types";
import { ViewTemplate } from "./view.types";

export type Endpoint = {
    environment?: string;
    host?: string;
    path: string;
    params: {[key: string]: any};
    return?: {
        objectName: string;
        actions: Action[];
    },
    result?: {
        customObject: boolean;
        objectName?: string;
    }
}

export type FetchDataSource = FetchDataHttp | FetchDataRef;

export type FetchDataHttp = {
    endpoint: Endpoint
}

export type FetchDataRef = {
    data: string;
}

export type FetchData = {
    type: 'http' | 'refData';
} & FetchDataSource;

export type ContentGeneric = {
    label: string;
    value: string | number | boolean | undefined;
}

export type Content = ContentGeneric | any;

export type ComponentData = ComponentDataView | any;

export type ComponentDataView = {
    header: string;
    content: Content[];
    fetchData: FetchData
}

export type BaseTemplate = {
    effect: ValidateObject;
}

export type Template = ViewTemplate | null;