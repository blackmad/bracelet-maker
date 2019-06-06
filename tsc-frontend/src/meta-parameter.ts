export enum MetaParameterType {
    Range,
    Select
}

export interface MetaParameter {
    name: string;
    type: MetaParameterType;
    title: string
}

export class RangeMetaParameter implements MetaParameter {
    public name: string;
    public type: MetaParameterType;
    public title: string;
    public min: number;
    public max: number;
    public value: number;
    public step: number;

    constructor({ name, type, title, min, max, value, step }: { 
        name: string;
        type: MetaParameterType;
        title: string;
        min: number;
        max: number;
        value: number;
        step: number;
    }) {
        this.name = name;
        this.type = type;
        this.title = title;
        this.min = min;
        this.max = max;
        this.value = value;
        this.step = step;
    }
}