import {
  MetaParameter,
  RangeMetaParameter,
  SelectMetaParameter,
  OnOffMetaParameter,
  MetaParameterType
} from "@/bracelet-maker/meta-parameter";
import { HasMetaParameters } from "@/bracelet-maker/model-maker";

import * as $ from "jquery";
import "rangeslider.js";

function clone(src) {
  return Object.assign({}, src);
}

export class MetaParameterBuilder {
  constructor(public params: any, public onParamChange: any) {}

  public makeMetaParameterSlider(metaParameter: RangeMetaParameter) {
    const value =
      Number(this.params[metaParameter.name]) || metaParameter.value;

    const { parentDiv, containingDiv } = this.makeMetaParameterContainer(
      metaParameter.title
    );

    const rangeInput = document.createElement("input");
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

    this.params[metaParameter.name] = Number(value);

    rangeInput.addEventListener(
      "change",
      function(event) {
        const value = event.target.value;
        textInput.value = value;
        this.onParamChange({ metaParameter, value });
      }.bind(this)
    );

    textInput.addEventListener(
      "change",
      function(event) {
        rangeInput.value = event.target.value;
        this.onParamChange({ metaParameter, value: event.target.value });
      }.bind(this)
    );

    return parentDiv;
  }

  public makeMetaParameterContainer(title) {
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

  public makeMetaParameterSelect(metaParameter) {
    const selectedValue =
      this.params[metaParameter.name] || metaParameter.value;

    const { parentDiv, containingDiv } = this.makeMetaParameterContainer(
      metaParameter.title
    );

    const colDiv = $('<div class="col-7 leftInputContainer"></div>');
    containingDiv.append(colDiv[0]);

    const selectInput = document.createElement("select");
    selectInput.name = metaParameter.name + "-select";

    metaParameter.options.forEach(optionValue => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.text = optionValue;
      if (optionValue == selectedValue) {
        option.setAttribute("selected", "selected");
      }
      selectInput.appendChild(option);
    });

    colDiv.append(selectInput);

    this.params[metaParameter.name] = selectedValue;

    selectInput.addEventListener(
      "change",
      function(event) {
        const selectedValue = event.target.selectedOptions[0].value;
        this.onParamChange({ metaParameter, value: selectedValue });
      }.bind(this)
    );

    return parentDiv;
  }

  public makeMetaParameterOnOff(metaParameter) {
    let selectedValue = this.params[metaParameter.name] == "true";
    if (this.params[metaParameter.name] == null) {
      selectedValue = metaParameter.value;
    }

    const { parentDiv, containingDiv } = this.makeMetaParameterContainer(
      metaParameter.title
    );
    const selectInput = document.createElement("select");
    selectInput.name = metaParameter.name + "-select";

    const switchDiv = $(`<div class="col-7 leftInputContainer">
      <input type="checkbox" checked autocomplete="off">
  </div>`);

    // const switchDiv = $(`<div><input type="checkbox"></input></div>`);
    containingDiv.append(switchDiv[0]);

    ($(switchDiv).find("input")[0] as HTMLInputElement).checked = selectedValue;

    this.params[metaParameter.name] = selectedValue;
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

  public makeMetaParameterGeocode(metaParameter) {
    if (this.params[metaParameter.name] == null) {
      this.params[metaParameter.name] = metaParameter.value;
    }

    const { parentDiv, containingDiv } = this.makeMetaParameterContainer(
      metaParameter.title
    );

    const selectInput = document.createElement("select");
    selectInput.name = metaParameter.name + "-select";

    const geocodeInputEl = $(
      '<input type="text" style="width:100%" autocomplete="off">'
    )[0];
    const latInputEl = $('<input type="text" size="7" autocomplete="off">')[0];
    const lngInputEl = $('<input type="text" size="7" autocomplete="off">')[0];
    latInputEl.value = metaParameter.value.split(",")[0];
    lngInputEl.value = metaParameter.value.split(",")[1];

    const switchDiv = $(`<div class="col-7 leftInputContainer"></div>`);
    switchDiv.append(lngInputEl);
    switchDiv.append(latInputEl);
    switchDiv.append(geocodeInputEl);
    containingDiv.append(switchDiv[0]);

    const self = this;

    latInputEl.addEventListener("change", function(event) {
      const value = event.target.value;
      if (value != metaParameter.value.split(",")[0]) {
        self.onParamChange({
          metaParameter,
          value: `${value},${lngInputEl.value}`
        });
      }
    });

    lngInputEl.addEventListener("change", function(event) {
      const value = event.target.value;
      if (value != metaParameter.value.split(",")[1]) {
        self.onParamChange({
          metaParameter,
          value: `${latInputEl.value},${value}`
        });
      }
    });

    // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(geocodeInputEl);

    autocomplete.addListener("place_changed", function() {
      var place = autocomplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      lngInputEl.value = lat;
      latInputEl.value = lng;
      self.onParamChange({ metaParameter, value: `${lat},${lng}` });
    });

    return parentDiv;
  }

  public buildMetaParameterWidget(metaParam: MetaParameter<any>) {
    switch (metaParam.type) {
      case MetaParameterType.Range:
        return this.makeMetaParameterSlider(metaParam as RangeMetaParameter);
      case MetaParameterType.Select:
        return this.makeMetaParameterSelect(metaParam);
      case MetaParameterType.OnOff:
        return this.makeMetaParameterOnOff(metaParam);
      case MetaParameterType.Geocode:
        return this.makeMetaParameterGeocode(metaParam);
      default:
        throw new Error("unknown metaParam - not slider or select");
    }
  }

  public buildMetaParametersForModel(
    modelMaker: HasMetaParameters,
    divToAppendTo: any
  ) {
    let groupDivs = {};

    const originalDivToAppendTo = divToAppendTo;
    if (modelMaker.metaParameters) {
      modelMaker.metaParameters.forEach(metaParameter => {
        const metaParam = clone(metaParameter);
        metaParam.name = modelMaker.constructor.name + "." + metaParameter.name;

        if (metaParam.target) {
          divToAppendTo = $(metaParam.target);
        } else if (metaParam.group) {
          if (!groupDivs[metaParam.group]) {
            const groupDiv = $(
              '<div class="meta-parameter-container col-md-12 col-lg-12 small border-top border-bottom py-1 row"></div>'
            );
            groupDiv.append(
              $(
                `<div class="row col-12"><h3>${metaParam.group} params</h3></div>`
              )
            );
            $(originalDivToAppendTo)
              .parent()
              .append(groupDiv[0]);
            groupDivs[metaParam.group] = groupDiv;
          }
          divToAppendTo = groupDivs[metaParam.group];
        } else {
          divToAppendTo = originalDivToAppendTo;
        }

        const el = this.buildMetaParameterWidget(metaParam);
        divToAppendTo.append(el);
      });
    }
    $('input[type="range"]').rangeslider();
  }
}
