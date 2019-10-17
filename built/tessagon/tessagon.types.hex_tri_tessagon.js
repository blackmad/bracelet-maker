// Transcrypt'ed from Python, 2019-10-15 14:58:58
import { __class__, __get__, __kwargtrans__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tessagon } from './tessagon.core.tessagon.js';
import { Tile } from './tessagon.core.tile.js';
var __name__ = 'tessagon.types.hex_tri_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Hexagons and Triangles', classification: 'archimedean', shapes: ['hexagons', 'triangles'], sides: [6, 3] }));
export var HexTriTile = __class__('HexTriTile', [Tile], {
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
            __super__(HexTriTile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
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
            return dict({ 'top': null, 'left': dict({ 'top': null, 'middle': null, 'bottom': null }), 'right': dict({ 'top': null, 'middle': null, 'bottom': null }), 'bottom': null });
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
            return dict({ 'center': dict({ 'top': null, 'middle': null, 'bottom': null }), 'left': dict({ 'top': dict({ 'triangle': null, 'hexagon': null }), 'bottom': dict({ 'triangle': null, 'hexagon': null }) }), 'right': dict({ 'top': dict({ 'triangle': null, 'hexagon': null }), 'bottom': dict({ 'triangle': null, 'hexagon': null }) }) });
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
            self.add_vert('top', 0.5, 1, __kwargtrans__({ v_boundary: true }));
            self.add_vert(['left', 'top'], 0.25, 0.75);
            self.add_vert(['left', 'middle'], 0, 0.5, __kwargtrans__({ u_boundary: true }));
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
            self.add_face(['center', 'middle'], [['left', 'top'], ['left', 'middle'], ['left', 'bottom'], ['right', 'bottom'], ['right', 'middle'], ['right', 'top']], __kwargtrans__({ face_type: 'hexagon' }));
            self.add_face(['center', 'top'], [['top'], ['left', 'top'], ['right', 'top']], __kwargtrans__({ face_type: 'triangle' }));
            self.add_face(['left', 'top', 'triangle'], [['left', 'top'], ['left', 'middle'], [['left'], ['right', 'top']]], __kwargtrans__({ face_type: 'triangle', u_boundary: true }));
            self.add_face(['left', 'top', 'hexagon'], [['top'], ['left', 'top'], [['left'], ['right', 'top']], [['left'], 'top'], [['left', 'top'], ['right', 'bottom']], [['top'], ['left', 'bottom']]], __kwargtrans__({ face_type: 'hexagon', corner: true }));
        });
    }
});
export var HexTriTessagon = __class__('HexTriTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: HexTriTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.hex_tri_tessagon.map
//# sourceMappingURL=tessagon.types.hex_tri_tessagon.js.map