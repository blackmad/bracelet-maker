// Transcrypt'ed from Python, 2019-10-15 14:58:58
import { __class__, __get__, __kwargtrans__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tessagon } from './tessagon.core.tessagon.js';
import { Tile } from './tessagon.core.tile.js';
var __name__ = 'tessagon.types.weave_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Weave', classification: 'non_edge', shapes: ['quads', 'rectangles'], sides: [4] }));
export var WeaveTile = __class__('WeaveTile', [Tile], {
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
            __super__(WeaveTile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
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
            return dict({ 'top': dict({ 'left': dict({ 'u_inner': dict({ 'v_inner': null, 'v_outer': null }), 'u_outer': dict({ 'v_inner': null, 'v_outer': null }) }), 'right': dict({ 'u_inner': dict({ 'v_inner': null, 'v_outer': null }), 'u_outer': dict({ 'v_inner': null, 'v_outer': null }) }) }), 'bottom': dict({ 'left': dict({ 'u_inner': dict({ 'v_inner': null, 'v_outer': null }), 'u_outer': dict({ 'v_inner': null, 'v_outer': null }) }), 'right': dict({ 'u_inner': dict({ 'v_inner': null, 'v_outer': null }), 'u_outer': dict({ 'v_inner': null, 'v_outer': null }) }) }) });
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
            return dict({ 'square': dict({ 'top': dict({ 'left': null, 'right': null }), 'bottom': dict({ 'left': null, 'right': null }) }), 'oct': dict({ 'top': dict({ 'left': null, 'center': null, 'right': null }), 'middle': dict({ 'left': null, 'center': null, 'right': null }), 'bottom': dict({ 'left': null, 'center': null, 'right': null }) }) });
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
            var u0 = 1.0 / 8.0;
            var u1 = 3.0 / 8.0;
            var v0 = 5.0 / 8.0;
            var v1 = 7.0 / 8.0;
            self.add_vert(['top', 'left', 'u_inner', 'v_inner'], u1, v0);
            self.add_vert(['top', 'left', 'u_inner', 'v_outer'], u1, v1);
            self.add_vert(['top', 'left', 'u_outer', 'v_inner'], u0, v0);
            self.add_vert(['top', 'left', 'u_outer', 'v_outer'], u0, v1);
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
            self.add_face(['square', 'top', 'left'], [['top', 'left', 'u_outer', 'v_outer'], ['top', 'left', 'u_inner', 'v_outer'], ['top', 'left', 'u_inner', 'v_inner'], ['top', 'left', 'u_outer', 'v_inner']], __kwargtrans__({ face_type: 'square' }));
            self.add_face(['oct', 'middle', 'center'], [['top', 'left', 'u_outer', 'v_inner'], ['top', 'left', 'u_inner', 'v_inner'], ['top', 'right', 'u_inner', 'v_inner'], ['top', 'right', 'u_outer', 'v_inner'], ['bottom', 'right', 'u_outer', 'v_inner'], ['bottom', 'right', 'u_inner', 'v_inner'], ['bottom', 'left', 'u_inner', 'v_inner'], ['bottom', 'left', 'u_outer', 'v_inner']], __kwargtrans__({ face_type: 'oct' }));
            self.add_face(['oct', 'top', 'left'], [['top', 'left', 'u_inner', 'v_outer'], ['top', 'left', 'u_outer', 'v_outer'], [['left'], ['top', 'right', 'u_outer', 'v_outer']], [['left'], ['top', 'right', 'u_inner', 'v_outer']], [['left', 'top'], ['bottom', 'right', 'u_inner', 'v_outer']], [['left', 'top'], ['bottom', 'right', 'u_outer', 'v_outer']], [['top'], ['bottom', 'left', 'u_outer', 'v_outer']], [['top'], ['bottom', 'left', 'u_inner', 'v_outer']]], __kwargtrans__({ face_type: 'oct', corner: true }));
            self.add_face(['oct', 'middle', 'left'], [['top', 'left', 'u_outer', 'v_outer'], ['top', 'left', 'u_outer', 'v_inner'], ['bottom', 'left', 'u_outer', 'v_inner'], ['bottom', 'left', 'u_outer', 'v_outer'], [['left'], ['bottom', 'right', 'u_outer', 'v_outer']], [['left'], ['bottom', 'right', 'u_outer', 'v_inner']], [['left'], ['top', 'right', 'u_outer', 'v_inner']], [['left'], ['top', 'right', 'u_outer', 'v_outer']]], __kwargtrans__({ face_type: 'oct', u_boundary: true }));
            self.add_face(['oct', 'top', 'center'], [['top', 'left', 'u_inner', 'v_outer'], ['top', 'left', 'u_inner', 'v_inner'], ['top', 'right', 'u_inner', 'v_inner'], ['top', 'right', 'u_inner', 'v_outer'], [['top'], ['bottom', 'right', 'u_inner', 'v_outer']], [['top'], ['bottom', 'right', 'u_inner', 'v_inner']], [['top'], ['bottom', 'left', 'u_inner', 'v_inner']], [['top'], ['bottom', 'left', 'u_inner', 'v_outer']]], __kwargtrans__({ face_type: 'oct', v_boundary: true }));
        });
    }
});
export var WeaveTessagon = __class__('WeaveTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: WeaveTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.weave_tessagon.map
//# sourceMappingURL=tessagon.types.weave_tessagon.js.map