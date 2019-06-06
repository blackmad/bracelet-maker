export enum MetaParameterType {
    Range,
    Select,
    OnOff
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

    constructor({ name, title, min, max, value, step }: { 
        name: string;
        title: string;
        min: number;
        max: number;
        value: number;
        step: number;
    }) {
        this.name = name;
        this.type = MetaParameterType.Range;
        this.title = title;
        this.min = min;
        this.max = max;
        this.value = value;
        this.step = step;
    }
}

export class SelectMetaParameter implements MetaParameter {
    public name: string;
    public type: MetaParameterType;
    public title: string;
    public options: string[];
    public value: string;

    constructor({ name, title, options, value}: { 
        name: string;
        title: string;
        options: string[];
        value: string;
    }) {
        this.name = name;
        this.type = MetaParameterType.Select;
        this.title = title;
        this.options = options;
        this.value = value;
    }
}

export class OnOffMetaParameter implements MetaParameter {
    public name: string;
    public type: MetaParameterType;
    public title: string;
    public value: boolean;

    constructor({name, title, value}: { 
        name: string;
        title: string;
        value: boolean;
    }) {
        this.name = name;
        this.type = MetaParameterType.OnOff;
        this.title = title;
        this.value = value;
    }
}

