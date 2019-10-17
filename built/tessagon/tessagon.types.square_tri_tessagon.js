// Transcrypt'ed from Python, 2019-10-15 14:58:58
import { __class__, __get__, __kwargtrans__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tessagon } from './tessagon.core.tessagon.js';
import { Tile } from './tessagon.core.tile.js';
import { sqrt } from './math.js';
var __name__ = 'tessagon.types.square_tri_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Squares and Triangles', classification: 'archimedean', shapes: ['squares', 'triangles'], sides: [4, 3] }));
export var SquareTriTile = __class__('SquareTriTile', [Tile], {
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
            __super__(SquareTriTile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
            self.u_symmetric = true;
            self.v_symmetric = true;
        });
    },
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
            return dict({ 'top': dict({ 'left': dict({ 'u_boundary': null, 'v_boundary': null }), 'right': dict({ 'u_boundary': null, 'v_boundary': null }), 'center': null }), 'bottom': dict({ 'left': dict({ 'u_boundary': null, 'v_boundary': null }), 'right': dict({ 'u_boundary': null, 'v_boundary': null }), 'center': null }), 'middle': dict({ 'left': null, 'right': null }) });
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
            return dict({ 'tri': dict({ 'top': dict({ 'left': dict({ 'u_boundary': null, 'v_boundary': null }), 'right': dict({ 'u_boundary': null, 'v_boundary': null }), 'center': null }), 'bottom': dict({ 'left': dict({ 'u_boundary': null, 'v_boundary': null }), 'right': dict({ 'u_boundary': null, 'v_boundary': null }), 'center': null }), 'middle': dict({ 'left': null, 'right': null }) }), 'square': dict({ 'top': dict({ 'left': null, 'right': null }), 'bottom': dict({ 'left': null, 'right': null }) }) });
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
            var u_unit = 1.0 / (1.0 + sqrt(3));
            var u0 = 0;
            var u1 = 0.5 * u_unit;
            var u2 = 0.5 * (1.0 - u_unit);
            var u3 = 0.5;
            var v_unit = 1.0 / (1.0 + sqrt(3));
            var v0 = 0.5;
            var v1 = 0.5 * (1.0 + v_unit);
            var v2 = 1.0 - 0.5 * v_unit;
            var v3 = 1.0;
            self.add_vert(['top', 'left', 'u_boundary'], u0, v1, __kwargtrans__({ u_boundary: true }));
            self.add_vert(['top', 'left', 'v_boundary'], u1, v3, __kwargtrans__({ v_boundary: true }));
            self.add_vert(['top', 'center'], u3, v2);
            self.add_vert(['middle', 'left'], u2, v0);
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
            self.add_face(['square', 'top', 'left'], [['top', 'left', 'u_boundary'], ['top', 'left', 'v_boundary'], ['top', 'center'], ['middle', 'left']], __kwargtrans__({ face_type: 'square' }));
            self.add_face(['tri', 'top', 'left', 'u_boundary'], [['top', 'left', 'v_boundary'], ['top', 'left', 'u_boundary'], [['left'], ['top', 'right', 'v_boundary']]], __kwargtrans__({ face_type: 'triangle', u_boundary: true }));
            self.add_face(['tri', 'top', 'left', 'v_boundary'], [['top', 'left', 'v_boundary'], ['top', 'center'], [['top'], ['bottom', 'center']]], __kwargtrans__({ face_type: 'triangle', v_boundary: true }));
            self.add_face(['tri', 'top', 'center'], [['top', 'center'], ['middle', 'right'], ['middle', 'left']], __kwargtrans__({ face_type: 'triangle' }));
            self.add_face(['tri', 'middle', 'left'], [['middle', 'left'], ['bottom', 'left', 'u_boundary'], ['top', 'left', 'u_boundary']], __kwargtrans__({ face_type: 'triangle' }));
        });
    }
});
export var SquareTriTessagon = __class__('SquareTriTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: SquareTriTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.square_tri_tessagon.map
//# sourceMappingURL=tessagon.types.square_tri_tessagon.js.map