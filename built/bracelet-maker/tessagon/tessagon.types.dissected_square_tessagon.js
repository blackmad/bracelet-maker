// Transcrypt'ed from Python, 2019-10-15 14:58:57
import { __class__, __get__, __kwargtrans__, __mod__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tile } from './tessagon.core.tile.js';
import { Tessagon } from './tessagon.core.tessagon.js';
var __name__ = 'tessagon.types.dissected_square_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Dissected Square', num_color_patterns: 2, classification: 'laves', shapes: ['triangles'], sides: [3] }));
export var DissectedSquareTile = __class__('DissectedSquareTile', [Tile], {
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
            __super__(DissectedSquareTile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
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
            return dict({ 'top': dict({ 'left': null, 'center': null, 'right': null }), 'middle': dict({ 'left': null, 'center': null, 'right': null }), 'bottom': dict({ 'left': null, 'center': null, 'right': null }) });
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
            return dict({ 'top': dict({ 'left': dict({ 'middle': null, 'center': null }), 'right': dict({ 'middle': null, 'center': null }) }), 'bottom': dict({ 'left': dict({ 'middle': null, 'center': null }), 'right': dict({ 'middle': null, 'center': null }) }) });
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
            self.add_vert(['top', 'left'], 0, 1.0, __kwargtrans__({ corner: true }));
            self.add_vert(['middle', 'left'], 0, 0.5, __kwargtrans__({ u_boundary: true }));
            self.add_vert(['top', 'center'], 0.5, 1.0, __kwargtrans__({ v_boundary: true }));
            self.add_vert(['middle', 'center'], 0.5, 0.5);
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
            self.add_face(['top', 'left', 'middle'], [['top', 'left'], ['middle', 'left'], ['middle', 'center']]);
            self.add_face(['top', 'left', 'center'], [['top', 'left'], ['middle', 'center'], ['top', 'center']]);
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
            self.color_paths([['top', 'left', 'center'], ['top', 'right', 'middle'], ['bottom', 'right', 'center'], ['bottom', 'left', 'middle']], 1, 0);
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
            if (__mod__(Math.floor(self.fingerprint[0] / 2) + Math.floor(self.fingerprint[1] / 2), 2) == 0) {
                self.color_tiles(1, 0);
            }
            else {
                self.color_tiles(0, 1);
            }
        });
    },
    get color_tiles() {
        return __get__(this, function (self, color1, color2) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'color1':
                                var color1 = __allkwargs0__[__attrib0__];
                                break;
                            case 'color2':
                                var color2 = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            if (__mod__(self.fingerprint[0], 2) == 0) {
                if (__mod__(self.fingerprint[1], 2) == 0) {
                    self.color_paths([['top', 'left', 'center'], ['bottom', 'right', 'middle']], color2, color1);
                }
                else {
                    self.color_paths([['bottom', 'left', 'center'], ['top', 'right', 'middle']], color2, color1);
                }
            }
            else if (__mod__(self.fingerprint[1], 2) == 0) {
                self.color_paths([['top', 'right', 'center'], ['bottom', 'left', 'middle']], color2, color1);
            }
            else {
                self.color_paths([['bottom', 'right', 'center'], ['top', 'left', 'middle']], color2, color1);
            }
        });
    }
});
export var DissectedSquareTessagon = __class__('DissectedSquareTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: DissectedSquareTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.dissected_square_tessagon.map
//# sourceMappingURL=tessagon.types.dissected_square_tessagon.js.map