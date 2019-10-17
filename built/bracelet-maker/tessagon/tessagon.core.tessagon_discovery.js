// Transcrypt'ed from Python, 2019-10-15 14:58:56
import { __class__, __get__, __kwargtrans__, dict, len, list, object, set } from './org.transcrypt.__runtime__.js';
import { Penta2Tessagon } from './tessagon.types.penta2_tessagon.js';
import { PentaTessagon } from './tessagon.types.penta_tessagon.js';
import { DissectedHexTriTessagon } from './tessagon.types.dissected_hex_tri_tessagon.js';
import { DissectedHexQuadTessagon } from './tessagon.types.dissected_hex_quad_tessagon.js';
import { DissectedTriangleTessagon } from './tessagon.types.dissected_triangle_tessagon.js';
import { DodecaTriTessagon } from './tessagon.types.dodeca_tri_tessagon.js';
import { SquareTri2Tessagon } from './tessagon.types.square_tri2_tessagon.js';
import { DissectedSquareTessagon } from './tessagon.types.dissected_square_tessagon.js';
import { ZigZagTessagon } from './tessagon.types.zig_zag_tessagon.js';
import { HexBigTriTessagon } from './tessagon.types.hex_big_tri_tessagon.js';
import { FloretTessagon } from './tessagon.types.floret_tessagon.js';
import { WeaveTessagon } from './tessagon.types.weave_tessagon.js';
import { SquareTriTessagon } from './tessagon.types.square_tri_tessagon.js';
import { DodecaTessagon } from './tessagon.types.dodeca_tessagon.js';
import { BrickTessagon } from './tessagon.types.brick_tessagon.js';
import { PythagoreanTessagon } from './tessagon.types.pythagorean_tessagon.js';
import { SquareTessagon } from './tessagon.types.square_tessagon.js';
import { HexSquareTriTessagon } from './tessagon.types.hex_square_tri_tessagon.js';
import { HexTriTessagon } from './tessagon.types.hex_tri_tessagon.js';
import { RhombusTessagon } from './tessagon.types.rhombus_tessagon.js';
import { OctoTessagon } from './tessagon.types.octo_tessagon.js';
import { TriTessagon } from './tessagon.types.tri_tessagon.js';
import { HexTessagon } from './tessagon.types.hex_tessagon.js';
var __name__ = 'tessagon.core.tessagon_discovery';
export var ALL = [SquareTessagon, HexTessagon, TriTessagon, OctoTessagon, HexTriTessagon, HexSquareTriTessagon, DodecaTessagon, SquareTriTessagon, SquareTri2Tessagon, DodecaTriTessagon, RhombusTessagon, FloretTessagon, DissectedSquareTessagon, DissectedTriangleTessagon, DissectedHexQuadTessagon, DissectedHexTriTessagon, PentaTessagon, Penta2Tessagon, PythagoreanTessagon, BrickTessagon, WeaveTessagon, HexBigTriTessagon, ZigZagTessagon];
export var TessagonDiscovery = __class__('TessagonDiscovery', [object], {
    __module__: __name__,
    get __init__() {
        return __get__(this, function (self) {
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
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            self.classes = kwargs.py_get('classes', ALL);
        });
    },
    get count() {
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
            return len(self.classes);
        });
    },
    get to_list() {
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
            return self.classes;
        });
    },
    get inverse() {
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
            var other_classes = list(set(ALL) - set(self.classes));
            return TessagonDiscovery(__kwargtrans__({ classes: other_classes }));
        });
    },
    get __add__() {
        return __get__(this, function (self, other) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'other':
                                var other = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            var new_classes = list(set(self.classes) | set(other.classes));
            return TessagonDiscovery(__kwargtrans__({ classes: new_classes }));
        });
    },
    get __sub__() {
        return __get__(this, function (self, other) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'other':
                                var other = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            var new_classes = list(set(self.classes) - set(other.classes));
            return TessagonDiscovery(__kwargtrans__({ classes: new_classes }));
        });
    },
    get with_color_patterns() {
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
            var results = [];
            for (var klass of self.classes) {
                if (klass.metadata === null) {
                    continue;
                }
                if (klass.metadata.has_color_patterns()) {
                    results.append(klass);
                }
            }
            return TessagonDiscovery(__kwargtrans__({ classes: results }));
        });
    },
    get with_classification() {
        return __get__(this, function (self, classification) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'classification':
                                var classification = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            var results = [];
            for (var klass of self.classes) {
                if (klass.metadata === null) {
                    continue;
                }
                if (klass.metadata.has_classification(classification)) {
                    results.append(klass);
                }
            }
            return TessagonDiscovery(__kwargtrans__({ classes: results }));
        });
    }
});
//# sourceMappingURL=tessagon.core.tessagon_discovery.map
//# sourceMappingURL=tessagon.core.tessagon_discovery.js.map