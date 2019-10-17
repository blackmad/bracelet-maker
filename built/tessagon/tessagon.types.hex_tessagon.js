// Transcrypt'ed from Python, 2019-10-15 14:58:58
import { __class__, __get__, __kwargtrans__, __mod__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tile } from './tessagon.core.tile.js';
import { Tessagon } from './tessagon.core.tessagon.js';
var __name__ = 'tessagon.types.hex_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Regular Hexagons', num_color_patterns: 2, classification: 'regular', shapes: ['hexagons'], sides: [6] }));
export var HexTile = __class__('HexTile', [Tile], {
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
            __super__(HexTile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
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
            return dict({ 'top': dict({ 'left': null, 'center': null, 'right': null }), 'bottom': dict({ 'left': null, 'center': null, 'right': null }) });
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
            return dict({ 'top': dict({ 'left': null, 'right': null }), 'middle': null, 'bottom': dict({ 'left': null, 'right': null }) });
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
            self.add_vert(['top', 'center'], 0.5, 5.0 / 6.0);
            self.add_vert(['top', 'left'], 0, 2.0 / 3.0, __kwargtrans__({ u_boundary: true }));
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
            self.add_face('middle', [['top', 'center'], ['top', 'left'], ['bottom', 'left'], ['bottom', 'center'], ['bottom', 'right'], ['top', 'right']]);
            self.add_face(['top', 'left'], [['top', 'left'], ['top', 'center'], [['top'], ['bottom', 'center']], [['top'], ['bottom', 'left']], [['top', 'left'], ['bottom', 'center']], [['left'], ['top', 'center']]], __kwargtrans__({ corner: true }));
        });
    },
    get color_pattern1() {
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
            if (__mod__(self.fingerprint[0], 3) == 0) {
                self.color_paths([['top', 'left'], ['bottom', 'left']], 1, 0);
            }
            else if (__mod__(self.fingerprint[0], 3) == 1) {
                self.color_paths([['middle']], 1, 0);
            }
            else {
                self.color_paths([['top', 'right'], ['bottom', 'right']], 1, 0);
            }
        });
    },
    get color_pattern2() {
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
            if (__mod__(self.fingerprint[0], 3) == 0) {
                self.color_paths_hash(dict({ 1: [['top', 'left'], ['bottom', 'left']], 2: [['top', 'right'], ['bottom', 'right']] }), 0);
            }
            else if (__mod__(self.fingerprint[0], 3) == 1) {
                self.color_paths_hash(dict({ 1: [['middle']], 2: [['top', 'left'], ['bottom', 'left']] }), 0);
            }
            else {
                self.color_paths_hash(dict({ 2: [['middle']], 1: [['top', 'right'], ['bottom', 'right']] }), 0);
            }
        });
    }
});
export var HexTessagon = __class__('HexTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: HexTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.hex_tessagon.map
//# sourceMappingURL=tessagon.types.hex_tessagon.js.map