// Transcrypt'ed from Python, 2019-10-15 14:58:58
import { __class__, __get__, __kwargtrans__, __mod__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tile } from './tessagon.core.tile.js';
import { Tessagon } from './tessagon.core.tessagon.js';
var __name__ = 'tessagon.types.tri_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Regular Triangles', num_color_patterns: 3, classification: 'regular', shapes: ['triangles'], sides: [3] }));
export var TriTile = __class__('TriTile', [Tile], {
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
            __super__(TriTile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
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
            return dict({ 'left': dict({ 'top': null, 'bottom': null }), 'middle': null, 'right': dict({ 'top': null, 'bottom': null }) });
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
            return dict({ 'left': dict({ 'top': null, 'middle': null, 'bottom': null }), 'right': dict({ 'top': null, 'middle': null, 'bottom': null }) });
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
            self.add_vert(['left', 'top'], 0, 1, __kwargtrans__({ corner: true }));
            self.add_vert('middle', 0.5, 0.5);
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
            self.add_face(['left', 'top'], [['left', 'top'], ['middle'], [['top'], ['middle']]], __kwargtrans__({ v_boundary: true }));
            self.add_face(['left', 'middle'], [['left', 'top'], ['left', 'bottom'], ['middle']]);
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
            self.color_face(['left', 'top'], 0);
            self.color_face(['right', 'top'], 1);
            self.color_face(['left', 'middle'], 1);
            self.color_face(['right', 'middle'], 0);
            self.color_face(['left', 'bottom'], 0);
            self.color_face(['right', 'bottom'], 1);
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
            if (!(self.fingerprint)) {
                return;
            }
            if (__mod__(self.fingerprint[1], 3) == 0) {
                if (__mod__(self.fingerprint[0], 3) == 0) {
                    self.color_0_0();
                }
                else if (__mod__(self.fingerprint[0], 3) == 1) {
                    self.color_0_1();
                }
            }
            else if (__mod__(self.fingerprint[1], 3) == 1) {
                if (__mod__(self.fingerprint[0], 3) == 0) {
                    self.color_1_0();
                }
                else if (__mod__(self.fingerprint[0], 3) == 1) {
                    self.color_1_1();
                }
                else {
                    self.color_1_2();
                }
            }
            else if (__mod__(self.fingerprint[0], 3) == 0) {
                self.color_2_0();
            }
            else if (__mod__(self.fingerprint[0], 3) == 1) {
                self.color_2_1();
            }
            else {
                self.color_2_2();
            }
        });
    },
    get color_pattern3() {
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
            if (!(self.fingerprint)) {
                return;
            }
            if (__mod__(self.fingerprint[1], 3) == 2) {
                self.color_paths([['left', 'middle'], ['right', 'bottom']], 1, 0);
            }
            else if (__mod__(self.fingerprint[1], 3) == 1) {
                self.color_paths([['right', 'top'], ['right', 'bottom']], 1, 0);
            }
            else {
                self.color_paths([['left', 'middle'], ['right', 'top']], 1, 0);
            }
        });
    },
    get color_0_0() {
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
            self.color_paths([], 0, 1);
        });
    },
    get color_0_1() {
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
            var paths = [['left', 'top'], ['left', 'bottom'], ['right', 'middle']];
            self.color_paths(paths, 1, 0);
        });
    },
    get color_1_0() {
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
            var paths = [['left', 'top'], ['left', 'bottom'], ['right', 'bottom']];
            self.color_paths(paths, 1, 0);
        });
    },
    get color_1_1() {
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
            var paths = [['left', 'bottom'], ['right', 'top'], ['right', 'middle']];
            self.color_paths(paths, 1, 0);
        });
    },
    get color_1_2() {
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
            var paths = [['left', 'top'], ['left', 'middle'], ['right', 'middle']];
            self.color_paths(paths, 1, 0);
        });
    },
    get color_2_0() {
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
            var paths = [['left', 'top'], ['left', 'bottom'], ['right', 'top']];
            self.color_paths(paths, 1, 0);
        });
    },
    get color_2_1() {
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
            var paths = [['left', 'top'], ['right', 'middle'], ['right', 'bottom']];
            self.color_paths(paths, 1, 0);
        });
    },
    get color_2_2() {
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
            var paths = [['left', 'middle'], ['left', 'bottom'], ['right', 'middle']];
            self.color_paths(paths, 1, 0);
        });
    }
});
export var TriTessagon = __class__('TriTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: TriTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.tri_tessagon.map
//# sourceMappingURL=tessagon.types.tri_tessagon.js.map