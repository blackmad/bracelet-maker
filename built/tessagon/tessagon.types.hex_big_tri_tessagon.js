// Transcrypt'ed from Python, 2019-10-15 14:58:58
import { __class__, __get__, __kwargtrans__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Stamp14, Stamp14Tessagon, Stamp14Tile } from './tessagon.core.stamp14_tessagon.js';
var __name__ = 'tessagon.types.hex_big_tri_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Hexagons and Big Triangles', classification: 'non_edge', shapes: ['hexagons', 'triangles'], sides: [6, 3] }));
export var Thingy = __class__('Thingy', [Stamp14], {
    __module__: __name__,
    get init_verts() {
        return __get__(this, function (self) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            return (function () {
                var __accu0__ = [];
                for (var i = 0; i < 13; i++) {
                    __accu0__.append(null);
                }
                return __accu0__;
            })();
        });
    },
    get init_faces() {
        return __get__(this, function (self) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            return (function () {
                var __accu0__ = [];
                for (var i = 0; i < 3; i++) {
                    __accu0__.append(null);
                }
                return __accu0__;
            })();
        });
    },
    get calculate_verts() {
        return __get__(this, function (self) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            var unit_u = 1.0 / 14.0;
            var unit_v = 1.0 / 14.0;
            var d_u = unit_u;
            var d_v = unit_v;
            self.add_offset_vert(0, d_u, d_v);
            self.add_offset_vert(2, -(d_u), d_v);
            self.add_offset_vert(3, -(d_u), -(d_v));
            self.add_offset_vert(5, d_u, -(d_v));
            var d_v = 2 * unit_v;
            self.add_offset_vert(1, 0, d_v);
            self.add_offset_vert(4, 0, -(d_v));
            var d_u = 2 * unit_u;
            self.add_offset_vert(6, d_u, 0);
            self.add_offset_vert(7, d_u, 2 * unit_v);
            self.add_offset_vert(8, d_u, 4 * unit_v);
            self.add_offset_vert(9, unit_u, 3 * unit_v);
            self.add_offset_vert(10, unit_u, -(3) * unit_v);
            self.add_offset_vert(11, 2 * unit_u, -(2) * unit_v);
            self.add_offset_vert(12, 3 * unit_u, -(1) * unit_v);
            var neighbor = self.neighbors[0];
            if (neighbor) {
                self.set_equivalent_vert(neighbor, 12, 4);
                self.set_equivalent_vert(neighbor, 6, 3);
                self.set_equivalent_vert(neighbor, 7, 2);
            }
            var neighbor = self.neighbors[1];
            if (neighbor) {
                self.set_equivalent_vert(neighbor, 7, 10);
                self.set_equivalent_vert(neighbor, 8, 5);
                self.set_equivalent_vert(neighbor, 9, 4);
            }
            var neighbor = self.neighbors[2];
            if (neighbor) {
                self.set_equivalent_vert(neighbor, 9, 12);
                self.set_equivalent_vert(neighbor, 1, 11);
                self.set_equivalent_vert(neighbor, 2, 10);
            }
            var neighbor = self.neighbors[3];
            if (neighbor) {
                self.set_equivalent_vert(neighbor, 2, 7);
                self.set_equivalent_vert(neighbor, 3, 6);
                self.set_equivalent_vert(neighbor, 4, 12);
            }
            var neighbor = self.neighbors[4];
            if (neighbor) {
                self.set_equivalent_vert(neighbor, 4, 9);
                self.set_equivalent_vert(neighbor, 5, 8);
                self.set_equivalent_vert(neighbor, 10, 7);
            }
            var neighbor = self.neighbors[5];
            if (neighbor) {
                self.set_equivalent_vert(neighbor, 10, 2);
                self.set_equivalent_vert(neighbor, 11, 1);
                self.set_equivalent_vert(neighbor, 12, 9);
            }
        });
    },
    get set_equivalent_vert() {
        return __get__(this, function (self, neighbor, src, dest) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'neighbor':
                                var neighbor = __allkwargs0__[__attrib0__];
                                break;
                            case 'src':
                                var src = __allkwargs0__[__attrib0__];
                                break;
                            case 'dest':
                                var dest = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            if (!(self.verts[src])) {
                return;
            }
            neighbor.verts[dest] = self.verts[src];
        });
    },
    get calculate_faces() {
        return __get__(this, function (self) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            self.faces[0] = self.tile.mesh_adaptor.create_face(self.verts.__getslice__(0, 6, 1));
            var verts = (function () {
                var __accu0__ = [];
                for (var i of [6, 7, 8, 9, 1, 0]) {
                    __accu0__.append(self.verts[i]);
                }
                return __accu0__;
            })();
            self.faces[1] = self.tile.mesh_adaptor.create_face(verts);
            var verts = (function () {
                var __accu0__ = [];
                for (var i of [10, 11, 12, 6, 0, 5]) {
                    __accu0__.append(self.verts[i]);
                }
                return __accu0__;
            })();
            self.faces[2] = self.tile.mesh_adaptor.create_face(verts);
        });
    }
});
export var HexBigTriTile = __class__('HexBigTriTile', [Stamp14Tile], {
    __module__: __name__,
    get __init__() {
        return __get__(this, function (self, tessagon) {
            var kwargs = dict();
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'tessagon':
                                var tessagon = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            __super__(HexBigTriTile, '__init__')(self, tessagon, Thingy, __kwargtrans__(kwargs));
        });
    }
});
export var HexBigTriTessagon = __class__('HexBigTriTessagon', [Stamp14Tessagon], {
    __module__: __name__,
    tile_class: HexBigTriTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.hex_big_tri_tessagon.map
//# sourceMappingURL=tessagon.types.hex_big_tri_tessagon.js.map