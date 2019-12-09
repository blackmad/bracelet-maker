export enum MetaParameterType {
    Range,
    Select,
    OnOff
}

export interface MetaParameter {
    name: string;
    type: MetaParameterType;
    title: string;
    value: any;
    target: string | null;
    group: string | null;
}

export interface MetaParameterBaseParams {
  name: string;
  title: string;
  value: any;
  target?: string | null;
  group?: string | null;
}

export interface RangeMetaParameterParams extends MetaParameterBaseParams {
  min: number;
  max: number;
  value: number;
  step: number;
}

export class RangeMetaParameter implements MetaParameter {
    public name: string;
    public type: MetaParameterType;
    public title: string;
    public min: number;
    public max: number;
    public value: number;
    public step: number;
    public target: string | null = null;
    public group: string | null;

    constructor(params: RangeMetaParameterParams) {
        this.name = params.name;
        this.type = MetaParameterType.Range;
        this.title = params.title;
        this.min = params.min;
        this.max = params.max;
        this.value = params.value;
        this.step = params.step;
        this.target = params.target;
        this.group = params.group;
    }
}

export interface SelectMetaParameterParams extends MetaParameterBaseParams {
  options: string[];
}

export class SelectMetaParameter implements MetaParameter {
    public name: string;
    public type: MetaParameterType;
    public title: string;
    public options: string[];
    public value: string;
    public target: string | null = null;
    public group: string | null;

    constructor(params: SelectMetaParameterParams) {
        this.name = params.name;
        this.type = MetaParameterType.Select;
        this.title = params.title;
        this.options = params.options;
        this.value = params.value;
        this.group = params.group;
    }
}

export class OnOffMetaParameter implements MetaParameter {
    public name: string;
    public type: MetaParameterType;
    public title: string;
    public value: boolean;
    public target: string | null = null;
    public group: string | null;

    constructor(params: MetaParameterBaseParams) {
        this.name = params.name;
        this.type = MetaParameterType.OnOff;
        this.title = params.title;
        this.value = params.value;
        this.group = params.group;
    }
}

