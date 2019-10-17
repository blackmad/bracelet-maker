// Transcrypt'ed from Python, 2019-10-15 14:58:58
import { __class__, __get__, __kwargtrans__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tessagon } from './tessagon.core.tessagon.js';
import { Tile } from './tessagon.core.tile.js';
import { sqrt } from './math.js';
var __name__ = 'tessagon.types.octo_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Octagons and Squares', classification: 'archimedean', shapes: ['octagons', 'squares'], sides: [8, 4] }));
export var OctoTile = __class__('OctoTile', [Tile], {
    __module__: __name__,
    CORNER_TO_VERT_RATIO: 1.0 / (2.0 + sqrt(2)),
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
            __super__(OctoTile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
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
            return dict({ 'left': dict({ 'top': dict({ 'u_boundary': null, 'v_boundary': null }), 'bottom': dict({ 'u_boundary': null, 'v_boundary': null }) }), 'right': dict({ 'top': dict({ 'u_boundary': null, 'v_boundary': null }), 'bottom': dict({ 'u_boundary': null, 'v_boundary': null }) }) });
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
            return dict({ 'middle': null, 'left': dict({ 'top': null, 'bottom': null }), 'right': dict({ 'top': null, 'bottom': null }) });
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
            self.add_vert(['left', 'top', 'v_boundary'], self.CORNER_TO_VERT_RATIO, 1, __kwargtrans__({ v_boundary: true }));
            self.add_vert(['left', 'top', 'u_boundary'], 0, 1.0 - self.CORNER_TO_VERT_RATIO, __kwargtrans__({ u_boundary: true }));
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
            self.add_face('middle', [['left', 'top', 'v_boundary'], ['left', 'top', 'u_boundary'], ['left', 'bottom', 'u_boundary'], ['left', 'bottom', 'v_boundary'], ['right', 'bottom', 'v_boundary'], ['right', 'bottom', 'u_boundary'], ['right', 'top', 'u_boundary'], ['right', 'top', 'v_boundary']]);
            self.add_face(['left', 'top'], [['left', 'top', 'v_boundary'], ['left', 'top', 'u_boundary'], [['left'], ['right', 'top', 'v_boundary']], [['top'], ['left', 'bottom', 'u_boundary']]], __kwargtrans__({ corner: true }));
        });
    }
});
export var OctoTessagon = __class__('OctoTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: OctoTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.octo_tessagon.map
//# sourceMappingURL=tessagon.types.octo_tessagon.js.map