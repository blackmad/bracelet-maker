// Transcrypt'ed from Python, 2019-10-15 14:58:57
import { __class__, __get__, __kwargtrans__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tessagon } from './tessagon.core.tessagon.js';
import { Tile } from './tessagon.core.tile.js';
var __name__ = 'tessagon.types.dissected_triangle_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Dissected Triangle', classification: 'laves', shapes: ['triangles'], sides: [3] }));
export var DissectedTriangleTile = __class__('DissectedTriangleTile', [Tile], {
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
            __super__(DissectedTriangleTile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
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
            return dict({ 'left': dict({ 'top': dict({ 'corner': null, 'v_boundary': null }), 'middle': null, 'bottom': dict({ 'corner': null, 'v_boundary': null }) }), 'right': dict({ 'top': dict({ 'corner': null, 'v_boundary': null }), 'middle': null, 'bottom': dict({ 'corner': null, 'v_boundary': null }) }), 'center': null });
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
            return dict({ 'left': dict({ 'top': dict({ 'center': null, 'interior1': null, 'interior2': null }), 'middle': null, 'bottom': dict({ 'center': null, 'interior1': null, 'interior2': null }) }), 'right': dict({ 'top': dict({ 'center': null, 'interior1': null, 'interior2': null }), 'middle': null, 'bottom': dict({ 'center': null, 'interior1': null, 'interior2': null }) }) });
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
            self.add_vert(['left', 'top', 'corner'], 0, 1, __kwargtrans__({ corner: true }));
            self.add_vert('center', 0.5, 0.5);
            self.add_vert(['left', 'top', 'v_boundary'], 1.0 / 3.0, 1, __kwargtrans__({ v_boundary: true }));
            self.add_vert(['left', 'middle'], 1.0 / 6.0, 0.5);
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
            self.add_face(['left', 'middle'], [['left', 'middle'], ['left', 'top', 'corner'], ['left', 'bottom', 'corner']]);
            self.add_face(['left', 'top', 'center'], [['center'], ['left', 'top', 'v_boundary'], [['top'], ['center']]], __kwargtrans__({ v_boundary: true }));
            self.add_face(['left', 'top', 'interior1'], [['center'], ['left', 'top', 'v_boundary'], ['left', 'top', 'corner']]);
            self.add_face(['left', 'top', 'interior2'], [['center'], ['left', 'middle'], ['left', 'top', 'corner']]);
        });
    }
});
export var DissectedTriangleTessagon = __class__('DissectedTriangleTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: DissectedTriangleTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.dissected_triangle_tessagon.map
//# sourceMappingURL=tessagon.types.dissected_triangle_tessagon.js.map