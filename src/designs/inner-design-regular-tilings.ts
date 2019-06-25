import { ModelMaker } from "../model";
import { MetaParameter, RangeMetaParameter } from "../meta-parameter";

var makerjs = require("makerjs");

// WIDTH = 1024
// HEIGHT = 1024
// SCALE = 64

// BACKGROUND_COLOR = 0x000000
// LINE_WIDTH = 0.1
// MARGIN = 0.1
// SHOW_LABELS = False

import * as _ from "lodash";

function normalize(x: number, y: number): string[] {
  return [x.toFixed(6), y.toFixed(6)];
}

function inset_corner(p1, p2, p3, margin) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [x3, y3] = p3;

  const a1 = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;
  const a2 = Math.atan2(y3 - y2, x3 - x2) - Math.PI / 2;
  const ax1 = x1 + Math.cos(a1) * margin;
  const ay1 = y1 + Math.sin(a1) * margin;
  const ax2 = x2 + Math.cos(a1) * margin;
  const ay2 = y2 + Math.sin(a1) * margin;
  const [bx1, by1] = [x2 + Math.cos(a2) * margin, y2 + Math.sin(a2) * margin];
  const [bx2, by2] = [x3 + Math.cos(a2) * margin, y3 + Math.sin(a2) * margin];
  const [ady, adx] = [ay2 - ay1, ax1 - ax2];
  const [bdy, bdx] = [by2 - by1, bx1 - bx2];
  const c1 = ady * ax1 + adx * ay1;
  const c2 = bdy * bx1 + bdx * by1;
  const d = ady * bdx - bdy * adx;
  const x = (bdx * c1 - adx * c2) / d;
  const y = (ady * c2 - bdy * c1) / d;
  return [x, y];
}

function inset_polygon(points, margin) {
  const result = [];
  points = [points[-2], ...points];
  for (const tuple in _.zip([points, _.drop(points, 1), _.drop(points, 2)])) {
    const [p1, p2, p3] = tuple;
    const point = inset_corner(p1, p2, p3, margin);
    result.push(point);
  }
  result.push(result[0]);
  return result;
}

class Shape {
  constructor(
    public sides: number,
    public x: number = 0,
    public y: number = 0,
    public rotation: number = 0
  ) {}

  points(margin: number = 0): Array<Array<number>> {
    const angle = (2 * Math.PI) / this.sides;
    let rotation = this.rotation - Math.PI / 2;
    if (this.sides % 2 == 0) {
      rotation += angle / 2;
    }
    let angles = _.times(this.sides, n => angle * n + rotation);
    angles.push(angles[0]);
    const d = 0.5 / Math.sin(angle / 2) - margin / Math.cos(angle / 2);
    return _.map(angles, a => [
      this.x + Math.cos(a) * d,
      this.y + Math.sin(a) * d
    ]);
  }

  adjacent(sides, edge) {
    console.log(`adjacent: sides ${sides}, edge: ${edge}`)
    const points = this.points()
    const [x1, y1] = points[edge];
    const nextIndex = edge + 2 == points.length ? 0 : edge +2;
    const [x2, y2] = points[nextIndex];
    const angle = (2 * Math.PI) / sides;
    let a = Math.atan2(y2 - y1, x2 - x1);
    const b = a - Math.PI / 2;
    const d = 0.5 / Math.tan(angle / 2);
    const x = x1 + (x2 - x1) / 2.0 + Math.cos(b) * d;
    const y = y1 + (y2 - y1) / 2.0 + Math.sin(b) * d;
    a += angle * ((sides - 1) / 2);
    return new Shape(sides, x, y, a);
  }

  copy(x: number, y: number): Shape {
    return new Shape(this.sides, x, y, this.rotation);
  }

  //     def render_edge_labels(self, dc, margin):
  //         points = self.points(margin)
  //         for edge in range(self.sides):
  //             (x1, y1), (x2, y2) = points[edge:edge + 2]
  //             text = str(edge)
  //             tw, th = dc.text_extents(text)[2:4]
  //             x = x1 + (x2 - x1) / 2.0 - tw / 2.0
  //             y = y1 + (y2 - y1) / 2.0 + th / 2.0
  //             dc.set_source_rgb(1, 1, 1)
  //             dc.move_to(x, y)
  //             dc.show_text(text)
  //     def render_label(self, dc, text):
  //         text = str(text)
  //         tw, th = dc.text_extents(text)[2:4]
  //         x = self.x - tw / 2.0
  //         y = self.y + th / 2.0
  //         dc.set_source_rgb(1, 1, 1)
  //         dc.move_to(x, y)
  //         dc.show_text(text)
}

class DualShape extends Shape {
  data = [];
  constructor(points: Array<number[]>) {
    super(points.length - 1);
    this.data = points;
  }

  points(self, margin = 0) {
    if (margin == 0) {
      return this.data;
    } else {
      return inset_polygon(this.data, margin);
    }
  }
}

class Model {
  shapes: Shape[] = [];
  lookup: Map<string[], Shape> = new Map<string[], Shape>();
  constructor(
    public width: number,
    public height: number,
    public scale: number
  ) {}

  append(shape: Shape) {
    this.shapes.push(shape);
    const key: string[] = normalize(shape.x, shape.y);
    this.lookup.set(key, shape);
  }

  _add(index: number, edge: number, sides: number) {
    console.log(`_add: index ${index}, edge: ${edge}, sides: ${sides}`)
    const parent = this.shapes[index];
    const shape = parent.adjacent(sides, edge);
    this.append(shape);
  }

  add(
    _indexes: number | number[],
    _edges: number | number[],
    sides: number
  ): number[] {
    console.log(`add: indexes ${_indexes}, edges: ${_edges}, sides: ${sides}`)
    let indexes: number[];
    if (_.isNumber(_indexes)) {
      indexes = [_indexes];
    } else {
      indexes = _indexes;
    }

    let edges: number[];
    if (_.isNumber(_edges)) {
      edges = [_edges];
    } else {
      edges = _edges;
    }

    const start = this.shapes.length;
    indexes.forEach(index =>
      edges.forEach(edge => this._add(index, edge, sides))
    );
    const end = this.shapes.length;
    return _.range(start, end);
  }

  add_repeats(x: number, y: number) {
    this.shapes.forEach(shape => {
      const key = normalize(x + shape.x, y + shape.y);
      if (!this.lookup.has(key)) {
        this.lookup.set(key, shape.copy(x + shape.x, y + shape.y));
      }
    });
  }

  _repeat(
    indexes: number[],
    x: number,
    y: number,
    depth: number,
    memo: Map<string[], number>
  ) {
    if (depth < 0) {
      return;
    }
    const key = normalize(x, y);
    const previous_depth = memo.get(key) || -1;
    if (previous_depth >= depth) {
      return;
    }
    console.log('adding ', key)
    memo.set(key, depth);
    if (previous_depth == -1) {
      this.add_repeats(x, y);
    }
    indexes.forEach(index => {
      const shape = this.shapes[index];
      console.log('shape ', shape.x, shape.y)
      this._repeat(indexes, x + shape.x, y + shape.y, depth - 1, memo);
    });
  }

  repeat(indexes: number[]) {
    const memo: Map<string[], number> = new Map<string[], number>();
    let depth = 0;
    while (true) {
      this._repeat(indexes, 0, 0, depth, memo);
      const w = this.width / 2.0 / this.scale;
      const h = this.height / 2.0 / this.scale;

      function memoHas(pred: (x: number, y: number) => boolean): boolean {
        for (let value of memo.keys()) {
          const x = Number(value[0]);
          const y = Number(value[1]);
          if (pred(x, y)) {
            return true;
          }
        }
        return false;
      }

      const tl = memoHas((x, y) => x < -w && y < -h);
      const tr = memoHas((x, y) => x > w && y < -h);
      const bl = memoHas((x, y) => x < -w && y > h);
      const br = memoHas((x, y) => x > w && y > h);
      console.log('depth', depth)
      if (tl && tr && bl && br) {
        break;
      }
      if (depth > 1) {
        break;
      }
      depth += 1;
    }
  }

  dual() {
    const vertexes: Map<string[], Shape[]> = new Map<string[], Shape[]>();
    for (let shape of this.lookup.values()) {
      const points = _.dropRight(shape.points(), 1);
      for (let [x, y] of points) {
        const key = normalize(x, y);
        const array: Shape[] = vertexes.get(key) || [];
        array.push(shape);
        vertexes.set(key, array);
      }
    }

    const result: Shape[] = [];
    for (const [[_x, _y], vShapes] of vertexes.entries()) {
      if (vShapes.length < 3) {
        continue;
      }
      const x = Number(_x);
      const y = Number(_y);
      function angle(shape: Shape) {
        return -1 * Math.atan2(shape.y - y, shape.x - x);
      }
      vShapes.sort(angle);
      const points = vShapes.map(shape => [shape.x, shape.y]);
      points.push(points[0]);
      result.push(new DualShape(points));
    }
    return result;
  }

  getShapes(dual: boolean = false): Shape[] {
    if (dual) {
      return this.dual();
    } else {
      return Array.from(this.lookup.values());
    }
  }
}

export class InnerDesignTilingsImpl implements MakerJs.IModel {
  public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};

  makeDesign(params): MakerJs.IModel {
    const model = new Model(1024, 1024, 64);
    model.append(new Shape(6))
    const a = model.add(0, _.range(6), 3)
    const b = model.add(a, 1, 6)
    model.repeat(b)
// return model.render(dual)
    model.getShapes().forEach((shape: Shape, index: number) => {
      this.models[index.toString()] = 
        new makerjs.models.ConnectTheDots(true, shape.points());
    })
    return this;
  }
}

export class InnerDesignTilings implements ModelMaker {
  get metaParameters(): Array<MetaParameter> { return [] }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignTilingsImpl().makeDesign(params);
  }
}

//     def render(
//             self, dual=False, background_color=BACKGROUND_COLOR, margin=MARGIN,
//             show_labels=SHOW_LABELS, line_width=LINE_WIDTH):
//         surface = cairo.ImageSurface(
//             cairo.FORMAT_RGB24, self.width, self.height)
//         dc = cairo.Context(surface)
//         dc.set_line_cap(cairo.LINE_CAP_ROUND)
//         dc.set_line_join(cairo.LINE_JOIN_ROUND)
//         dc.set_line_width(line_width)
//         dc.set_font_size(18.0 / self.scale)
//         dc.translate(self.width / 2, self.height / 2)
//         dc.scale(self.scale, self.scale)
//         dc.set_source_rgb(*color(background_color))
//         dc.paint()
//         shapes = 
//         if show_labels:
//             for shape in shapes:
//                 shape.render_edge_labels(dc, margin - 0.25)
//         for shape in shapes:
//             shape.render(dc, margin)
//         if show_labels:
//             for index, shape in enumerate(self.shapes):
//                 if shape in shapes:
//                     shape.render_label(dc, index)
//         return surface
