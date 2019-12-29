export enum MetaParameterType {
  Range,
  Select,
  OnOff,
  Geocode
}

export interface MetaParameterBaseParams<T> {
  name: string;
  title: string;
  value: T;
  target?: string | null;
  group?: string | null;
  help?: string | null;
}

export class MetaParameter<T> {
  public name: string;
  public title: string;
  public target: string | null = null;
  public group: string | null;
  public help: string | null;
  public value: T;
  public type: MetaParameterType;

  valueFromString(value: string) {
    if (typeof this.value == "number") {
      return Number(value);
    } else if (typeof this.value == "boolean") {
      return value == "true";
    } else {
      return value;
    }
  }

  constructor(params: MetaParameterBaseParams<T>) {
    this.name = params.name;
    this.title = params.title;
    this.target = params.target;
    this.group = params.group;
    this.help = params.help;
    this.value = params.value;
  }
}

export interface RangeMetaParameterParams
  extends MetaParameterBaseParams<number> {
  min: number;
  max: number;
  step: number;
}

export class RangeMetaParameter extends MetaParameter<number> {
  public min: number;
  public max: number;
  public step: number;
  public type = MetaParameterType.Range;

  constructor(params: RangeMetaParameterParams) {
    super(params);
    this.min = params.min;
    this.max = params.max;
    this.step = params.step;
  }
}

export interface SelectMetaParameterParams
  extends MetaParameterBaseParams<string> {
  options: string[];
}

export class SelectMetaParameter extends MetaParameter<string> {
  public options: string[];
  public type = MetaParameterType.Select;

  constructor(params: SelectMetaParameterParams) {
    super(params);
    this.options = params.options;
  }
}

export interface OnOffMetaParameterParams
  extends MetaParameterBaseParams<boolean> {}

export class OnOffMetaParameter extends MetaParameter<boolean> {
public type = MetaParameterType.OnOff;
  constructor(params: OnOffMetaParameterParams) {
    super(params);
  }
}

export interface GeocodeMetaParameterParams
  extends MetaParameterBaseParams<string> {
  text: string;
}
export class GeocodeMetaParameter extends MetaParameter<string> {
  public text: string;
  public value: string;
  public type = MetaParameterType.Geocode;

  constructor(params: GeocodeMetaParameterParams) {
    super(params);
    this.value = params.value;
    this.text = params.text;
  }
}
