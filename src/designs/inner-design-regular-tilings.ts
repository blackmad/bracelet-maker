
// WIDTH = 1024
// HEIGHT = 1024
// SCALE = 64

// BACKGROUND_COLOR = 0x000000
// LINE_WIDTH = 0.1
// MARGIN = 0.1
// SHOW_LABELS = False

function normalize(x, y) {
  return [x.toFixed(6), y.toFixed(6)]
}

function inset_corner(p1, p2, p3, margin) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [x3, y3] = p3;

    const a1 = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2
    const a2 = Math.atan2(y3 - y2, x3 - x2) - Math.PI / 2
    const ax1 = x1 + Math.cos(a1) * margin
    const ay1 = y1 + Math.sin(a1) * margin
    const ax2 = x2 + Math.cos(a1) * margin
    const ay2 = y2 + Math.sin(a1) * margin
    const [bx1, by1] = [x2 + Math.cos(a2) * margin, y2 + Math.sin(a2) * margin]
    const [bx2, by2] = [x3 + Math.cos(a2) * margin, y3 + Math.sin(a2) * margin]
    const [ady, adx] = [ay2 - ay1, ax1 - ax2]
    const [bdy, bdx] = [by2 - by1, bx1 - bx2]
    const c1 = ady * ax1 + adx * ay1
    const c2 = bdy * bx1 + bdx * by1
    const d = ady * bdx - bdy * adx
    const x = (bdx * c1 - adx * c2) / d
    const y = (ady * c2 - bdy * c1) / d
    return [x, y]
}

function inset_polygon(points, margin) {
  const result = []
  points = [points[-2], ...points]
  for (const tuple in _.zip([points, _.drop(points, 1), _.drop(points, 2)])) {
    const [p1, p2, p3] = tuple;
    const point = inset_corner(p1, p2, p3, margin)
    result.push(point)
  }
  result.push(result[0])
  return result
}

class Shape {
  constructor(
    public sides: number, 
    public x: number = 0,
    public y: number = 0,
    public rotation: number = 0) {
  }

  points(margin: number = 0): Array<Array<number>> {
    const angle = 2 * Math.PI / this.sides
    let rotation = this.rotation - Math.PI / 2
    if (this.sides % 2 == 0) {
        rotation += angle / 2
    }
    let angles = _.times(this.sides, (n) => angle * n + rotation)
    angles.push(angles[0])
    const d = 0.5 / Math.sin(angle / 2) - margin / Math.cos(angle / 2)
    return _.map(angles, (a) => [this.x + Math.cos(a) * d, this.y + Math.sin(a) * d])
  }

  adjacent(sides, edge) {
    const [x1, y1] = this.points()[edge];
    const [x2, y2] = this.points()[edge + 2]
    const angle = 2 * Math.PI / sides;
    let a = Math.atan2(y2 - y1, x2 - x1);
    const b = a - Math.PI / 2;
    const d = 0.5 / Math.tan(angle / 2);
    const x = x1 + (x2 - x1) / 2.0 + Math.cos(b) * d;
    const y = y1 + (y2 - y1) / 2.0 + Math.sin(b) * d;
    a += angle * ((sides - 1) / 2);
    return new Shape(sides, x, y, a);
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
  constructor(points: Array<number>) {
    super(points.length - 1) 
    this.data = points;
  }
  
  points(self, margin=0) {
    if (margin == 0) {
      return this.data
    } else {
      return inset_polygon(this.data, margin)
    }
  }
}

class Model {
  shapes: Shape[] = []
  lookup = {}
  constructor(
    public width: number,
    public height: number,
    public scale: number
  ) {}

  append(shape: Shape) {
    this.shapes.push(shape)
    const key = normalize(shape.x, shape.y)
    self.lookup[key] = shape
  }
//     def _add(self, index, edge, sides, **kwargs):
//         parent = self.shapes[index]
//         shape = parent.adjacent(sides, edge, **kwargs)
//         self.append(shape)
//     def add(self, indexes, edges, sides, **kwargs):
//         if isinstance(indexes, int):
//             indexes = [indexes]
//         if isinstance(edges, int):
//             edges = [edges]
//         start = len(self.shapes)
//         for index in indexes:
//             for edge in edges:
//                 self._add(index, edge, sides, **kwargs)
//         end = len(self.shapes)
//         return range(start, end)
//     def add_repeats(self, x, y):
//         for shape in self.shapes:
//             key = normalize(x + shape.x, y + shape.y)
//             if key in self.lookup:
//                 continue
//             self.lookup[key] = shape.copy(x + shape.x, y + shape.y)
//     def _repeat(self, indexes, x, y, depth, memo):
//         if depth < 0:
//             return
//         key = normalize(x, y)
//         previous_depth = memo.get(key, -1)
//         if previous_depth >= depth:
//             return
//         memo[key] = depth
//         if previous_depth == -1:
//             self.add_repeats(x, y)
//         for index in indexes:
//             shape = self.shapes[index]
//             self._repeat(
//                 indexes, x + shape.x, y + shape.y, depth - 1, memo)
//     def repeat(self, indexes):
//         memo = {}
//         depth = 0
//         while True:
//             self._repeat(indexes, 0, 0, depth, memo)
//             w = self.width / 2.0 / self.scale
//             h = self.height / 2.0 / self.scale
//             tl = any(x < -w and y < -h for x, y in memo)
//             tr = any(x > w and y < -h for x, y in memo)
//             bl = any(x < -w and y > h for x, y in memo)
//             br = any(x > w and y > h for x, y in memo)
//             if tl and tr and bl and br:
//                 break
//             depth += 1
//     def dual(self):
//         vertexes = {}
//         for shape in self.lookup.values():
//             for (x, y) in shape.points()[:-1]:
//                 key = normalize(x, y)
//                 vertexes.setdefault(key, []).append(shape)
//         result = []
//         for (x, y), shapes in vertexes.items():
//             if len(shapes) < 3:
//                 continue
//             def angle(shape):
//                 return Math.atan2(shape.y - y, shape.x - x)
//             shapes.sort(key=angle, reverse=True)
//             points = [(shape.x, shape.y) for shape in shapes]
//             points.append(points[0])
//             result.append(DualShape(points))
//         return result
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
//         shapes = self.dual() if dual else self.lookup.values()
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
