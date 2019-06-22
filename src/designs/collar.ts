import { RangeMetaParameter, MetaParameterType } from "../meta-parameter";
import { ModelMaker } from "../model";

var makerjs = require("makerjs");


class StraightCollarImpl {
  // implements MakerJs.IModel {
  public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};

  // constructor(innerDesignClass: ModelMaker, options) {
  //   var {
  //     height,
  //     neckSize,
  //     safeBorderWidth
  //   } = options["StraightCollar"];
    
  //   const collarPadding = 3;
    
  //   new makerjs.models.Rectangle(
      
  //   )
  // }
}



