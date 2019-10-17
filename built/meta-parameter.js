export var MetaParameterType;
(function (MetaParameterType) {
    MetaParameterType[MetaParameterType["Range"] = 0] = "Range";
    MetaParameterType[MetaParameterType["Select"] = 1] = "Select";
    MetaParameterType[MetaParameterType["OnOff"] = 2] = "OnOff";
})(MetaParameterType || (MetaParameterType = {}));
export class RangeMetaParameter {
    constructor(params) {
        this.target = null;
        this.name = params.name;
        this.type = MetaParameterType.Range;
        this.title = params.title;
        this.min = params.min;
        this.max = params.max;
        this.value = params.value;
        this.step = params.step;
        this.target = params.target;
    }
}
export class SelectMetaParameter {
    constructor(params) {
        this.target = null;
        this.name = params.name;
        this.type = MetaParameterType.Select;
        this.title = params.title;
        this.options = params.options;
        this.value = params.value;
    }
}
export class OnOffMetaParameter {
    constructor(params) {
        this.target = null;
        this.name = params.name;
        this.type = MetaParameterType.OnOff;
        this.title = params.title;
        this.value = params.value;
    }
}
//# sourceMappingURL=meta-parameter.js.map