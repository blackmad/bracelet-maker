// Transcrypt'ed from Python, 2019-10-15 14:58:57
import { __class__, __get__, __kwargtrans__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tessagon } from './tessagon.core.tessagon.js';
import { Tile } from './tessagon.core.tile.js';
var __name__ = 'tessagon.types.dissected_hex_quad_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Hexagons Dissected with Quads', classification: 'laves', shapes: ['quads'], sides: [4] }));
export var DissectedHexQuadTile = __class__('DissectedHexQuadTile', [Tile], {
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
            __super__(DissectedHexQuadTile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
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
            return dict({ 'left': dict({ 'top': dict({ 'corner': null, 'interior': null, 'u_boundary': null }), 'middle': null, 'bottom': dict({ 'corner': null, 'interior': null, 'u_boundary': null }) }), 'right': dict({ 'top': dict({ 'corner': null, 'interior': null, 'u_boundary': null }), 'middle': null, 'bottom': dict({ 'corner': null, 'interior': null, 'u_boundary': null }) }), 'center': dict({ 'middle': null, 'top': dict({ 'v_boundary': null, 'interior': null }), 'bottom': dict({ 'v_boundary': null, 'interior': null }) }) });
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
            return dict({ 'left': dict({ 'top': dict({ 'v_boundary': null, 'u_boundary': null, 'middle': null }), 'bottom': dict({ 'v_boundary': null, 'u_boundary': null, 'middle': null }) }), 'right': dict({ 'top': dict({ 'v_boundary': null, 'u_boundary': null, 'middle': null }), 'bottom': dict({ 'v_boundary': null, 'u_boundary': null, 'middle': null }) }), 'center': dict({ 'top': null, 'bottom': null }) });
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
            self.add_vert(['left', 'top', 'interior'], 0.25, 0.75);
            self.add_vert(['left', 'top', 'u_boundary'], 0, 2.0 / 3.0, __kwargtrans__({ u_boundary: true }));
            self.add_vert(['left', 'middle'], 0, 0.5, __kwargtrans__({ u_boundary: true }));
            self.add_vert(['center', 'middle'], 0.5, 0.5);
            self.add_vert(['center', 'top', 'v_boundary'], 0.5, 1.0, __kwargtrans__({ v_boundary: true }));
            self.add_vert(['center', 'top', 'interior'], 0.5, 5.0 / 6.0);
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
            self.add_face(['left', 'top', 'v_boundary'], [['left', 'top', 'corner'], ['center', 'top', 'v_boundary'], ['center', 'top', 'interior'], ['left', 'top', 'interior']]);
            self.add_face(['left', 'top', 'u_boundary'], [['left', 'top', 'corner'], ['left', 'top', 'interior'], ['left', 'top', 'u_boundary'], [['left'], ['right', 'top', 'interior']]], __kwargtrans__({ u_boundary: true }));
            self.add_face(['left', 'top', 'middle'], [['left', 'top', 'interior'], ['center', 'middle'], ['left', 'middle'], ['left', 'top', 'u_boundary']]);
            self.add_face(['center', 'top'], [['center', 'middle'], ['left', 'top', 'interior'], ['center', 'top', 'interior'], ['right', 'top', 'interior']]);
        });
    }
});
export var DissectedHexQuadTessagon = __class__('DissectedHexQuadTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: DissectedHexQuadTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.dissected_hex_quad_tessagon.map
//# sourceMappingURL=tessagon.types.dissected_hex_quad_tessagon.js.map