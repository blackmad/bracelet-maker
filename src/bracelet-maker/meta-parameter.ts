import * as _ from "lodash";
import * as nyc from "./geojson/simplified/nyc.json";
import turfBBox from "@turf/bbox";
import turfBooleanPointInPolygon from "@turf/boolean-point-in-polygon";

export enum MetaParameterType {
  Range,
  Select,
  OnOff,
  Geocode,
}

export interface MetaParameterBaseParams<T> {
  name: string;
  title: string;
  value: T;
  target?: string | null;
  group?: string | null;
  help?: string | null;
  shouldDisplay?: Function;
  parentParam?: OnOffMetaParameter;
}

export abstract class MetaParameter<T> {
  public name: string;
  public title: string;
  public target: string | null = null;
  public group: string | null;
  public help: string | null;
  public value: T;
  public type: MetaParameterType;
  public shouldDisplay?: Function;
  public parentParam?: OnOffMetaParameter;

  valueFromString(value: string) {
    if (typeof this.value == "number") {
      return Number(value);
    } else if (typeof this.value == "boolean") {
      return value == "true";
    } else {
      return value;
    }
  }

  public abstract getRandomValue(): T;

  constructor(params: MetaParameterBaseParams<T>) {
    this.name = params.name;
    this.title = params.title;
    this.target = params.target;
    this.group = params.group;
    this.help = params.help;
    this.value = params.value;
    this.shouldDisplay = params.shouldDisplay;
    this.parentParam = params.parentParam;
  }
}

export interface RangeMetaParameterParams
  extends MetaParameterBaseParams<number> {
  min: number;
  max: number;
  step: number;
  randMin?: number;
  randMax?: number;
}

export class RangeMetaParameter extends MetaParameter<number> {
  public min: number;
  public max: number;
  public randMin: number;
  public randMax: number;
  public step: number;
  public type = MetaParameterType.Range;

  constructor(params: RangeMetaParameterParams) {
    super(params);
    this.min = params.min;
    this.max = params.max;
    this.randMin = params.randMin;
    this.randMax = params.randMax;
    this.step = params.step;
  }

  getRandomValue() {
    if (!this.randMin || !this.randMax) {
      return this.value;
    }

    const steps = (this.randMax - this.randMin) / this.step;
    const randStep = _.random(0, steps);
    const value = this.randMin + randStep * this.step;

    return value;
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

  getRandomValue() {
    return _.sample(this.options);
  }
}

export interface OnOffMetaParameterParams
  extends MetaParameterBaseParams<boolean> {
  allowRandomize?: boolean;
}

export class OnOffMetaParameter extends MetaParameter<boolean> {
  public type = MetaParameterType.OnOff;
  private allowRandomize: boolean;

  constructor(params: OnOffMetaParameterParams) {
    super(params);
    if (params.allowRandomize === undefined) {
      params.allowRandomize = true;
    }
    this.allowRandomize = params.allowRandomize;
  }

  getRandomValue() {
    if (!this.allowRandomize) {
      return this.value;
    }
    return Math.random() > 0.5;
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

  getRandomValue() {
    const [minX, minY, maxX, maxY] = turfBBox(nyc.features[0]);

    console.log("geo rand");

    let tries = 0;

    while (tries < 1000) {
      const x = _.random(minX, maxX);
      const y = _.random(minY, maxY);
      console.log("trying", { x, y });
      if (turfBooleanPointInPolygon([x, y], nyc.features[0] as any)) {
        console.log(`${y},${x}`);
        return `${y},${x}`;
      }
      tries += 1;
    }
  }
}
