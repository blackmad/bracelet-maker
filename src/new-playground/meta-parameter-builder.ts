import {
  MetaParameter,
  RangeMetaParameter,
  SelectMetaParameter,
  OnOffMetaParameter,
  MetaParameterType,
  GeocodeMetaParameter
} from "@/bracelet-maker/meta-parameter";
import { HasMetaParameters } from "@/bracelet-maker/model-maker";

import $ from 'jquery';
import * as _ from "lodash";
import "rangeslider.js";

function clone(src) {
  return Object.assign({}, src);
}

function makeMetaParameterContainer(title) {
  const sizingDiv = document.createElement("div");
  sizingDiv.className =
    "meta-parameter-container col-md-12 col-lg-6 small border-top border-bottom py-1";

  const containingDiv = document.createElement("div");
  containingDiv.className = "row";

  sizingDiv.append(containingDiv);

  const textLabelDiv = document.createElement("div");
  textLabelDiv.className = "col-5";
  textLabelDiv.innerHTML = title;
  containingDiv.append(textLabelDiv);

  return { parentDiv: sizingDiv, containingDiv };
}

abstract class RenderedMetaParameter {
  private element = null;
  public metaParameter: MetaParameter<any>;

  el() {
    if (!this.element) {
      this.element = this.render();
    }
    return this.element;
  }

  hide() {
    $(this.element).hide();
  }

  show() {
    $(this.element).show();
  }
  abstract render();
  abstract randomize(onParamChange: Function);
}

class RenderedGeocodeMetaParameter extends RenderedMetaParameter {
  lngInputEl: HTMLInputElement;
  latInputEl: HTMLInputElement;

  public constructor(
    public metaParameter: GeocodeMetaParameter,
    private initialParams,
    public onParamChange
  ) {
    super();
  }

  public randomize(onParamChange: Function) {
    const value = this.metaParameter.getRandomValue();
    const lat = value.split(",")[0];
    const lng = value.split(",")[1];
    
    this.lngInputEl.value = lat;
    this.latInputEl.value = lng;
    console.log(value);
    
    const { metaParameter } = this;
    onParamChange({ metaParameter, value });
  }

  public render() {
    const metaParameter = this.metaParameter;
    if (this.initialParams[metaParameter.name] == null) {
      this.initialParams[metaParameter.name] = metaParameter.value;
    }

    const { parentDiv, containingDiv } = makeMetaParameterContainer(metaParameter.title);

    const selectInput = document.createElement("select");
    selectInput.name = metaParameter.name + "-select";

    const geocodeInputEl = $('<input type="text" style="width:100%" autocomplete="off">')[0];
    this.latInputEl = $('<input type="text" size="7" autocomplete="off">')[0] as HTMLInputElement;
    this.lngInputEl = $('<input type="text" size="7" autocomplete="off">')[0] as HTMLInputElement;
    this.latInputEl.value = this.initialParams[metaParameter.name].split(",")[0];
    this.lngInputEl.value = this.initialParams[metaParameter.name].split(",")[1];

    const switchDiv = $(`<div class="col-7 leftInputContainer"></div>`);
    switchDiv.append(this.lngInputEl);
    switchDiv.append(this.latInputEl);
    switchDiv.append(geocodeInputEl);
    containingDiv.append(switchDiv[0]);

    const self = this;

    this.latInputEl.addEventListener("change", (event) => {
      const value = (event.target as any).value;
      if (value != metaParameter.value.split(",")[0]) {
        self.onParamChange({
          metaParameter,
          value: `${value},${this.lngInputEl.value}`
        });
      }
    });

    this.lngInputEl.addEventListener("change", (event) => {
      const value = (event.target as any).value;
      if (value != metaParameter.value.split(",")[1]) {
        self.onParamChange({
          metaParameter,
          value: `${this.latInputEl.value},${value}`
        });
      }
    });

    // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(geocodeInputEl);

    autocomplete.addListener("place_changed", () => {
      var place = autocomplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      this.lngInputEl.value = lat;
      this.latInputEl.value = lng;
      self.onParamChange({ metaParameter, value: `${lat},${lng}` });
    });

    return parentDiv;
  }
}

class RenderedOnOffMetaParameter extends RenderedMetaParameter {
  checkBox = null;

  public constructor(
    public metaParameter: OnOffMetaParameter,
    private initialParams,
    public onParamChange
  ) {
    super();
  }

  public randomize(onParamChange: Function) {
    this.checkBox.checked = this.metaParameter.getRandomValue();
    onParamChange({ metaParameter: this.metaParameter, value: this.checkBox.checked });
  }

  public render() {
    const metaParameter = this.metaParameter;
    let selectedValue = this.initialParams[metaParameter.name] == "true";
    if (this.initialParams[metaParameter.name] == null) {
      selectedValue = metaParameter.value;
    }

    const { parentDiv, containingDiv } = makeMetaParameterContainer(metaParameter.title);
    const selectInput = document.createElement("select");
    selectInput.name = metaParameter.name + "-select";

    const switchDiv = $(`<div class="col-7 leftInputContainer">
    <input type="checkbox" checked autocomplete="off">
</div>`);

    // const switchDiv = $(`<div><input type="checkbox"></input></div>`);
    containingDiv.append(switchDiv[0]);

    this.checkBox = $(switchDiv).find("input")[0] as HTMLInputElement;
    this.checkBox.checked = selectedValue;

    this.initialParams[metaParameter.name] = selectedValue;
    const id = metaParameter.name;
    $(switchDiv)
      .find("input")
      .attr("id", id);
    $(switchDiv)
      .find("label")
      .attr("for", id);

    $(switchDiv)
      .find("input")
      .on(
        "change",
        function(event) {
          const selectedValue = (event.target as HTMLInputElement).checked;
          this.onParamChange({ metaParameter, value: selectedValue });
        }.bind(this)
      );

    return parentDiv;
  }
}

class RenderedRangeMetaParameter extends RenderedMetaParameter {
  public constructor(
    public metaParameter: RangeMetaParameter,
    private initialParams,
    public onParamChange
  ) {
    super();
  }

  textInput: any;
  rangeInput: any;

  public randomize(onParamChange: Function) {
    const value = this.metaParameter.getRandomValue();
    this.textInput.value = value;
    this.rangeInput.value = value;
    onParamChange({ metaParameter: this.metaParameter, value });
  }

  public render() {
    const metaParameter = this.metaParameter;
    const value = Number(this.initialParams[metaParameter.name]) || metaParameter.value;

    const { parentDiv, containingDiv } = makeMetaParameterContainer(metaParameter.title);

    const rangeInput = document.createElement("input");
    this.rangeInput = rangeInput;
    rangeInput.type = "range";
    rangeInput.name = metaParameter.name + "-range";
    rangeInput.min = metaParameter.min.toString();
    rangeInput.max = metaParameter.max.toString();
    rangeInput.step = metaParameter.step.toString();
    rangeInput.id = metaParameter.name + "-range";
    rangeInput.value = value.toString();
    rangeInput.className = "col-4";

    const inputWrapDiv = document.createElement("div");
    inputWrapDiv.className = "col-3";
    const textInput = document.createElement("input");
    this.textInput = textInput;
    textInput.type = "number";
    textInput.min = metaParameter.min.toString();
    textInput.max = metaParameter.max.toString();
    textInput.step = metaParameter.step.toString();
    textInput.id = metaParameter.name + "-num-input";
    textInput.value = value.toString();
    textInput.className = "mx-1";

    containingDiv.append(rangeInput);
    containingDiv.append(inputWrapDiv);
    inputWrapDiv.append(textInput);

    this.initialParams[metaParameter.name] = Number(value);

    rangeInput.addEventListener(
      "change",
      function(event) {
        const value = event.target.value;
        textInput.value = value;
        this.onParamChange({ metaParameter, value: Number(value) });
      }.bind(this)
    );

    textInput.addEventListener(
      "change",
      function(event) {
        rangeInput.value = event.target.value;
        this.onParamChange({ metaParameter, value: Number(event.target.value) });
      }.bind(this)
    );

    return parentDiv;
  }
}

class RenderedSelectMetaParameter extends RenderedMetaParameter {
  options = [];

  public constructor(
    public metaParameter: SelectMetaParameter,
    private initialParams,
    public onParamChange
  ) {
    super();
  }

  public randomize(onParamChange: Function) {
    const value = this.metaParameter.getRandomValue();
    this.options.forEach(option => {
      option.selected = option.value === value;
    });
    console.log("random select to", value);
    onParamChange({ metaParameter: this.metaParameter, value });
  }

  public render() {
    const selectedValue = this.initialParams[this.metaParameter.name] || this.metaParameter.value;

    const { parentDiv, containingDiv } = makeMetaParameterContainer(this.metaParameter.title);

    const colDiv = $('<div class="col-7 leftInputContainer"></div>');
    containingDiv.append(colDiv[0]);

    const selectInput = document.createElement("select");
    selectInput.name = this.metaParameter.name + "-select";

    this.metaParameter.options.forEach(optionValue => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.text = optionValue;
      if (optionValue == selectedValue) {
        option.setAttribute("selected", "selected");
      }
      this.options.push(option);
      selectInput.appendChild(option);
    });

    colDiv.append(selectInput);

    this.onParamChange({ metaParameter: this.metaParameter, value: selectedValue });

    selectInput.addEventListener(
      "change",
      function(event) {
        const selectedValue = event.target.selectedOptions[0].value;
        this.onParamChange({ metaParameter: this.metaParameter, value: selectedValue });
      }.bind(this)
    );

    return parentDiv;
  }
}

export class MetaParameterBuilder {
  params: any = {};
  renderedMetaParameters = [];

  constructor(public initialParams: any, public _onParamChange: any) {
    this.params = { ...initialParams };
  }

  onParamChange = ({ metaParameter, value }) => {
    // this.params[metaParameter.name] = value;
    this._onParamChange({ metaParameter, value });
  };

  public buildMetaParameterWidget(metaParam: MetaParameter<any>) {
    switch (metaParam.type) {
      case MetaParameterType.Range:
        return new RenderedRangeMetaParameter(
          metaParam as RangeMetaParameter,
          this.initialParams,
          this.onParamChange
        );
      case MetaParameterType.Select:
        return new RenderedSelectMetaParameter(
          metaParam as SelectMetaParameter,
          this.initialParams,
          this.onParamChange
        );
      case MetaParameterType.OnOff:
        return new RenderedOnOffMetaParameter(
          metaParam as OnOffMetaParameter,
          this.initialParams,
          this.onParamChange
        );
      case MetaParameterType.Geocode:
        return new RenderedGeocodeMetaParameter(
          metaParam as GeocodeMetaParameter,
          this.initialParams,
          this.onParamChange
        );
      default:
        throw new Error("unknown metaParam - not slider or select");
    }
  }

  public buildMetaParametersForModel(modelMaker: HasMetaParameters, divToAppendTo: any) {
    let groupDivs = {};

    const originalDivToAppendTo = divToAppendTo;

    if (modelMaker.metaParameters) {
      modelMaker.metaParameters.forEach(metaParameter => {
        const metaParam = metaParameter;
        metaParam.name = modelMaker.constructor.name + "." + metaParameter.name;

        if (metaParam.target) {
          divToAppendTo = $(metaParam.target);
        } else if (metaParam.group) {
          if (!groupDivs[metaParam.group]) {
            const groupDiv = $(
              '<div class="meta-parameter-container col-md-12 col-lg-12 small py-1 row"></div>'
            );
            groupDiv.append($(`<div class="row col-12"><h3>${metaParam.group} params</h3></div>`));
            $(originalDivToAppendTo)
              .parent()
              .append(groupDiv[0]);
            groupDivs[metaParam.group] = groupDiv;
          }
          divToAppendTo = groupDivs[metaParam.group];
        } else {
          divToAppendTo = originalDivToAppendTo;
        }

        const renderedMetaParameter = this.buildMetaParameterWidget(metaParam);
        this.renderedMetaParameters.push(renderedMetaParameter);
        divToAppendTo.append(renderedMetaParameter.el());
      });
    }
    $('input[type="range"]').rangeslider();
  }

  rerender(_params) {
    const params = {};
    _.forEach(_params, (v, k) => {
      params[k.split(".")[1]] = v;
    });

    this.renderedMetaParameters.forEach((renderedMetaParameter: RenderedMetaParameter) => {
      const metaParameter = renderedMetaParameter.metaParameter;
      if (metaParameter.parentParam) {
        const parentValue = params[metaParameter.parentParam.name];
        if (parentValue) {
          renderedMetaParameter.show();
        } else {
          renderedMetaParameter.hide();
        }
      }

      if (metaParameter.shouldDisplay) {
        if (metaParameter.shouldDisplay(params)) {
          renderedMetaParameter.show();
        } else {
          renderedMetaParameter.hide();
        }
      }
    });
  }

  public randomize(onParamChange: Function) {
    this.renderedMetaParameters.forEach((renderedMetaParameter: RenderedMetaParameter) => {
      renderedMetaParameter.randomize(onParamChange);
    });
  }
}
