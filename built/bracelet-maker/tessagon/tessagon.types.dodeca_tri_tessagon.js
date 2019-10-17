// Transcrypt'ed from Python, 2019-10-15 14:58:57
import { __class__, __get__, __kwargtrans__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tessagon } from './tessagon.core.tessagon.js';
import { Tile } from './tessagon.core.tile.js';
import { sqrt } from './math.js';
var __name__ = 'tessagon.types.dodeca_tri_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Dodecagons and Triangles', classification: 'archimedean', shapes: ['dodecagons', 'triangles'], sides: [12, 3] }));
export var DodecaTriTile = __class__('DodecaTriTile', [Tile], {
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
            __super__(DodecaTriTile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
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
            return dict({ 'left': dict({ 'top': dict({ 'v_boundary': null, 'diag': null, 'tri': null }), 'middle': null, 'bottom': dict({ 'v_boundary': null, 'diag': null, 'tri': null }) }), 'right': dict({ 'top': dict({ 'v_boundary': null, 'diag': null, 'tri': null }), 'middle': null, 'bottom': dict({ 'v_boundary': null, 'diag': null, 'tri': null }) }) });
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
            return dict({ 'dodec': dict({ 'left': dict({ 'top': null, 'bottom': null }), 'right': dict({ 'top': null, 'bottom': null }), 'center': null }), 'tri': dict({ 'left': dict({ 'top': null, 'middle': null, 'bottom': null }), 'right': dict({ 'top': null, 'middle': null, 'bottom': null }) }) });
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
            var u_unit = 1.0 / (3.0 + 2.0 * sqrt(3));
            var u_h = (0.5 * sqrt(3)) * u_unit;
            var u1 = 0.5 * u_unit;
            var u2 = u1 + u_h;
            var u3 = u2 + u1;
            var u4 = u3 + u_h;
            var v_unit = 1.0 / (2.0 + sqrt(3));
            var v_h = (0.5 * sqrt(3)) * v_unit;
            var v1 = 0;
            var v2 = 0.5 * v_unit;
            var v3 = v2 + v_h;
            var v4 = 0.5;
            self.add_vert(['left', 'middle'], u1, v4);
            self.add_vert(['left', 'bottom', 'v_boundary'], u4, v1, __kwargtrans__({ v_boundary: true }));
            self.add_vert(['left', 'bottom', 'diag'], u3, v2);
            self.add_vert(['left', 'bottom', 'tri'], u2, v3);
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
            self.add_face(['dodec', 'left', 'bottom'], [['left', 'middle'], ['left', 'bottom', 'tri'], ['left', 'bottom', 'diag'], [['bottom'], ['left', 'top', 'diag']], [['bottom'], ['left', 'top', 'tri']], [['bottom'], ['left', 'middle']], [['bottom', 'left'], ['right', 'middle']], [['bottom', 'left'], ['right', 'top', 'tri']], [['bottom', 'left'], ['right', 'top', 'diag']], [['left'], ['right', 'bottom', 'diag']], [['left'], ['right', 'bottom', 'tri']], [['left'], ['right', 'middle']]], __kwargtrans__({ face_type: 'dodecagon', corner: true }));
            self.add_face(['dodec', 'center'], [['left', 'bottom', 'tri'], ['left', 'bottom', 'diag'], ['left', 'bottom', 'v_boundary'], ['right', 'bottom', 'v_boundary'], ['right', 'bottom', 'diag'], ['right', 'bottom', 'tri'], ['right', 'top', 'tri'], ['right', 'top', 'diag'], ['right', 'top', 'v_boundary'], ['left', 'top', 'v_boundary'], ['left', 'top', 'diag'], ['left', 'top', 'tri']], __kwargtrans__({ face_type: 'dodecagon' }));
            self.add_face(['tri', 'left', 'middle'], [['left', 'top', 'tri'], ['left', 'bottom', 'tri'], ['left', 'middle']], __kwargtrans__({ face_type: 'triangle' }));
            self.add_face(['tri', 'left', 'bottom'], [['left', 'bottom', 'diag'], ['left', 'bottom', 'v_boundary'], [['bottom'], ['left', 'top', 'diag']]], __kwargtrans__({ face_type: 'triangle', v_boundary: true }));
        });
    }
});
export var DodecaTriTessagon = __class__('DodecaTriTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: DodecaTriTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.dodeca_tri_tessagon.map
//# sourceMappingURL=tessagon.types.dodeca_tri_tessagon.js.map