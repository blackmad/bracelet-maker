// Transcrypt'ed from Python, 2019-10-15 14:58:57
import { ValueError, __class__, __get__, __in__, __kwargtrans__, __mod__, __super__, callable, dict, getattr, isinstance, list, py_typeof } from './org.transcrypt.__runtime__.js';
import { AbstractTile } from './tessagon.core.abstract_tile.js';
var __name__ = 'tessagon.core.tile';
export var Merge = function (dict1, dict2) {
    if (arguments.length) {
        var __ilastarg0__ = arguments.length - 1;
        if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
            var __allkwargs0__ = arguments[__ilastarg0__--];
            for (var __attrib0__ in __allkwargs0__) {
                switch (__attrib0__) {
                    case 'dict1':
                        var dict1 = __allkwargs0__[__attrib0__];
                        break;
                    case 'dict2':
                        var dict2 = __allkwargs0__[__attrib0__];
                        break;
                }
            }
        }
    }
    else {
    }
    var newDict = dict({});
    for (var [k, v] of dict1.py_items()) {
        newDict[k] = v;
    }
    for (var [k, v] of dict2.py_items()) {
        newDict[k] = v;
    }
    return newDict;
};
export var Tile = __class__('Tile', [AbstractTile], {
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
            __super__(Tile, '__init__')(self, tessagon, __kwargtrans__(kwargs));
            self.mesh_adaptor = tessagon.mesh_adaptor;
            self.verts = self.init_verts();
            self.faces = self.init_faces();
            self.color_pattern = kwargs.py_get('color_pattern') || null;
            if (self.faces && self.color_pattern) {
                self.face_paths = self.all_face_paths();
            }
        });
    },
    get add_vert() {
        return __get__(this, function (self, index_keys, ratio_u, ratio_v) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'ratio_u':
                                var ratio_u = __allkwargs0__[__attrib0__];
                                break;
                            case 'ratio_v':
                                var ratio_v = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            var vert = self._get_vert(index_keys);
            if (vert === null) {
                var coords = self.f(...self.blend(ratio_u, ratio_v));
                var vert = self.mesh_adaptor.create_vert(coords);
                self._set_vert(index_keys, vert);
                if (__in__('vert_type', kwargs)) {
                    if (!(__in__(kwargs['vert_type'], self.tessagon.vert_types))) {
                        self.tessagon.vert_types[kwargs['vert_type']] = [];
                    }
                    self.tessagon.vert_types[kwargs['vert_type']].append(vert);
                }
            }
            self._create_symmetric_verts(index_keys, ratio_u, ratio_v, __kwargtrans__(kwargs));
            self._set_equivalent_neighbor_verts(index_keys, vert, __kwargtrans__(kwargs));
            return vert;
        });
    },
    get set_equivalent_vert() {
        return __get__(this, function (self, neighbor_keys, index_keys, vert) {
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
                            case 'neighbor_keys':
                                var neighbor_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'vert':
                                var vert = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            if (vert === null) {
                return null;
            }
            var tile = self.get_neighbor_tile(neighbor_keys);
            if (tile === null) {
                return null;
            }
            tile._set_vert(self._index_path(index_keys, neighbor_keys), vert);
        });
    },
    get add_face() {
        return __get__(this, function (self, index_keys, vert_index_keys_list) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'vert_index_keys_list':
                                var vert_index_keys_list = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            if (self._get_face(index_keys) !== null) {
                return null;
            }
            var verts = self._get_verts_from_list(vert_index_keys_list);
            if (verts === null) {
                return null;
            }
            var face = self.mesh_adaptor.create_face(verts);
            self._set_face(index_keys, face);
            if (__in__('face_type', kwargs)) {
                if (!(__in__(kwargs['face_type'], self.tessagon.face_types))) {
                    self.tessagon.face_types[kwargs['face_type']] = [];
                }
                self.tessagon.face_types[kwargs['face_type']].append(face);
            }
            self._create_symmetric_faces(index_keys, vert_index_keys_list, __kwargtrans__(kwargs));
            self._set_equivalent_neighbor_faces(index_keys, face, __kwargtrans__(kwargs));
            return face;
        });
    },
    get num_color_patterns() {
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
            return self.tessagon.num_color_patterns();
        });
    },
    get calculate_colors() {
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
            if (self.color_pattern > self.num_color_patterns()) {
                var __except0__ = ValueError(__mod__('color_pattern must be below %d', self.num_color_patterns()));
                __except0__.__cause__ = null;
                throw __except0__;
            }
            var method_name = __mod__('color_pattern%d', self.color_pattern);
            var method = getattr(self, method_name);
            if (!(callable(method))) {
                var __except0__ = ValueError(__mod__('%s is not a callable color pattern', method_name));
                __except0__.__cause__ = null;
                throw __except0__;
            }
            method();
        });
    },
    get color_face() {
        return __get__(this, function (self, index_keys, color_index) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'color_index':
                                var color_index = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            var face = self._get_face(index_keys);
            if (face === null) {
                return;
            }
            self.mesh_adaptor.color_face(face, color_index);
        });
    },
    get set_equivalent_face() {
        return __get__(this, function (self, neighbor_keys, index_keys, face) {
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
                            case 'neighbor_keys':
                                var neighbor_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'face':
                                var face = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            var tile = self.get_neighbor_tile(neighbor_keys);
            if (tile === null) {
                return null;
            }
            tile._set_face(self._index_path(index_keys, neighbor_keys), face);
        });
    },
    get all_face_paths() {
        return __get__(this, function (self, faces, base_path) {
            if (typeof faces == 'undefined' || (faces != null && faces.hasOwnProperty("__kwargtrans__"))) {
                ;
                var faces = null;
            }
            ;
            if (typeof base_path == 'undefined' || (base_path != null && base_path.hasOwnProperty("__kwargtrans__"))) {
                ;
                var base_path = null;
            }
            ;
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'faces':
                                var faces = __allkwargs0__[__attrib0__];
                                break;
                            case 'base_path':
                                var base_path = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            if (faces === null) {
                var faces = self.faces;
            }
            if (base_path === null) {
                var base_path = [];
            }
            var paths = [];
            for (var index of faces) {
                var new_base_path = base_path + [index];
                if (py_typeof(faces[index]) === dict) {
                    paths += self.all_face_paths(faces[index], new_base_path);
                }
                else {
                    paths.append(new_base_path);
                }
            }
            return paths;
        });
    },
    get color_paths() {
        return __get__(this, function (self, paths, color, color_other) {
            if (typeof color_other == 'undefined' || (color_other != null && color_other.hasOwnProperty("__kwargtrans__"))) {
                ;
                var color_other = null;
            }
            ;
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'paths':
                                var paths = __allkwargs0__[__attrib0__];
                                break;
                            case 'color':
                                var color = __allkwargs0__[__attrib0__];
                                break;
                            case 'color_other':
                                var color_other = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            for (var path of self.face_paths) {
                if (__in__(path, paths)) {
                    self.color_face(path, color);
                }
                else if (color_other) {
                    self.color_face(path, color_other);
                }
            }
        });
    },
    get color_paths_hash() {
        return __get__(this, function (self, hash, color_other) {
            if (typeof color_other == 'undefined' || (color_other != null && color_other.hasOwnProperty("__kwargtrans__"))) {
                ;
                var color_other = null;
            }
            ;
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'hash':
                                var hash = __allkwargs0__[__attrib0__];
                                break;
                            case 'color_other':
                                var color_other = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            for (var path of self.face_paths) {
                for (var color of hash) {
                    var done = false;
                    if (__in__(path, hash[color])) {
                        self.color_face(path, color);
                        var done = true;
                        break;
                    }
                }
                if (color_other && !(done)) {
                    self.color_face(path, color_other);
                }
            }
        });
    },
    get _get_vert() {
        return __get__(this, function (self, index_keys) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            return self._get_nested_list_value(self.verts, index_keys);
        });
    },
    get _set_vert() {
        return __get__(this, function (self, index_keys, value) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'value':
                                var value = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            self._set_nested_list_value(self.verts, index_keys, value);
        });
    },
    get _get_face() {
        return __get__(this, function (self, index_keys) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            return self._get_nested_list_value(self.faces, index_keys);
        });
    },
    get _set_face() {
        return __get__(this, function (self, index_keys, value) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'value':
                                var value = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            self._set_nested_list_value(self.faces, index_keys, value);
        });
    },
    get _get_neighbor_vert() {
        return __get__(this, function (self, neighbor_keys, index_keys) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'neighbor_keys':
                                var neighbor_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            var tile = self.get_neighbor_tile(neighbor_keys);
            if (tile === null) {
                return null;
            }
            return tile._get_vert(self._index_path(index_keys, neighbor_keys));
        });
    },
    get _create_symmetric_verts() {
        return __get__(this, function (self, index_keys, ratio_u, ratio_v) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'ratio_u':
                                var ratio_u = __allkwargs0__[__attrib0__];
                                break;
                            case 'ratio_v':
                                var ratio_v = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            if (!__in__('symmetry', kwargs)) {
                var extra_args = dict({ 'symmetry': true });
                if (self.u_symmetric) {
                    var u_flip_keys = self._u_flip(index_keys);
                    self.add_vert(u_flip_keys, 1.0 - ratio_u, ratio_v, __kwargtrans__(Merge(kwargs, extra_args)));
                    if (self.v_symmetric) {
                        var uv_flip_keys = self._v_flip(u_flip_keys);
                        self.add_vert(uv_flip_keys, 1.0 - ratio_u, 1.0 - ratio_v, __kwargtrans__(Merge(kwargs, extra_args)));
                    }
                }
                if (self.v_symmetric) {
                    var v_flip_keys = self._v_flip(index_keys);
                    self.add_vert(v_flip_keys, ratio_u, 1.0 - ratio_v, __kwargtrans__(Merge(kwargs, extra_args)));
                }
            }
        });
    },
    get _set_equivalent_neighbor_verts() {
        return __get__(this, function (self, index_keys, vert) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'vert':
                                var vert = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            if (__in__('u_boundary', kwargs)) {
                self._set_u_equivalent_vert(index_keys, vert, __kwargtrans__(kwargs));
            }
            if (__in__('v_boundary', kwargs)) {
                self._set_v_equivalent_vert(index_keys, vert, __kwargtrans__(kwargs));
            }
            if (__in__('corner', kwargs)) {
                self._set_u_equivalent_vert(index_keys, vert, __kwargtrans__(kwargs));
                self._set_v_equivalent_vert(index_keys, vert, __kwargtrans__(kwargs));
                self._set_uv_equivalent_vert(index_keys, vert, __kwargtrans__(kwargs));
            }
        });
    },
    get _set_u_equivalent_vert() {
        return __get__(this, function (self, index_keys, vert) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'vert':
                                var vert = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            var u_index = self._u_index(index_keys);
            var u_flip_keys = self._u_flip(index_keys);
            self.set_equivalent_vert([u_index], u_flip_keys, vert, __kwargtrans__(kwargs));
        });
    },
    get _set_v_equivalent_vert() {
        return __get__(this, function (self, index_keys, vert) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'vert':
                                var vert = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            var v_index = self._v_index(index_keys);
            var v_flip_keys = self._v_flip(index_keys);
            self.set_equivalent_vert([v_index], v_flip_keys, vert, __kwargtrans__(kwargs));
        });
    },
    get _set_uv_equivalent_vert() {
        return __get__(this, function (self, index_keys, vert) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'vert':
                                var vert = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            var u_index = self._u_index(index_keys);
            var v_index = self._v_index(index_keys);
            var u_flip_keys = self._u_flip(index_keys);
            var uv_flip_keys = self._v_flip(u_flip_keys);
            self.set_equivalent_vert([u_index, v_index], uv_flip_keys, vert, __kwargtrans__(kwargs));
        });
    },
    get _get_verts_from_list() {
        return __get__(this, function (self, vert_index_keys_list) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'vert_index_keys_list':
                                var vert_index_keys_list = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            var verts = [];
            for (var vert_index_keys of vert_index_keys_list) {
                if (isinstance(vert_index_keys[0], list)) {
                    var vert = self._get_neighbor_vert(vert_index_keys[0], vert_index_keys[1]);
                }
                else {
                    var vert = self._get_vert(vert_index_keys);
                }
                if (vert === null) {
                    return null;
                }
                verts.append(vert);
            }
            return verts;
        });
    },
    get _create_symmetric_faces() {
        return __get__(this, function (self, index_keys, vert_index_keys_list) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'vert_index_keys_list':
                                var vert_index_keys_list = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            if (!__in__('symmetry', kwargs)) {
                var extra_args = dict({ 'symmetry': true });
                if (self.u_symmetric) {
                    var u_flip_keys = self._u_flip(index_keys);
                    var u_flip_vert_index_keys_list = self._u_flip(vert_index_keys_list);
                    self.add_face(u_flip_keys, u_flip_vert_index_keys_list, __kwargtrans__(Merge(kwargs, extra_args)));
                    if (self.v_symmetric) {
                        var uv_flip_keys = self._v_flip(u_flip_keys);
                        var uv_flip_vert_index_keys_list = self._v_flip(u_flip_vert_index_keys_list);
                        self.add_face(uv_flip_keys, uv_flip_vert_index_keys_list, __kwargtrans__(Merge(kwargs, extra_args)));
                    }
                }
                if (self.v_symmetric) {
                    var v_flip_keys = self._v_flip(index_keys);
                    var v_flip_vert_index_keys_list = self._v_flip(vert_index_keys_list);
                    self.add_face(v_flip_keys, v_flip_vert_index_keys_list, __kwargtrans__(Merge(kwargs, extra_args)));
                }
            }
        });
    },
    get _set_equivalent_neighbor_faces() {
        return __get__(this, function (self, index_keys, face) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'face':
                                var face = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            if (__in__('u_boundary', kwargs)) {
                self._set_u_equivalent_face(index_keys, face, __kwargtrans__(kwargs));
            }
            if (__in__('v_boundary', kwargs)) {
                self._set_v_equivalent_face(index_keys, face, __kwargtrans__(kwargs));
            }
            if (__in__('corner', kwargs)) {
                self._set_u_equivalent_face(index_keys, face, __kwargtrans__(kwargs));
                self._set_v_equivalent_face(index_keys, face, __kwargtrans__(kwargs));
                self._set_uv_equivalent_face(index_keys, face, __kwargtrans__(kwargs));
            }
        });
    },
    get _set_u_equivalent_face() {
        return __get__(this, function (self, index_keys, face) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'face':
                                var face = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            var u_index = self._u_index(index_keys);
            var u_flip_keys = self._u_flip(index_keys);
            self.set_equivalent_face([u_index], u_flip_keys, face, __kwargtrans__(kwargs));
        });
    },
    get _set_v_equivalent_face() {
        return __get__(this, function (self, index_keys, face) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'face':
                                var face = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            var v_index = self._v_index(index_keys);
            var v_flip_keys = self._v_flip(index_keys);
            self.set_equivalent_face([v_index], v_flip_keys, face, __kwargtrans__(kwargs));
        });
    },
    get _set_uv_equivalent_face() {
        return __get__(this, function (self, index_keys, face) {
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
                            case 'index_keys':
                                var index_keys = __allkwargs0__[__attrib0__];
                                break;
                            case 'face':
                                var face = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            var u_index = self._u_index(index_keys);
            var v_index = self._v_index(index_keys);
            var u_flip_keys = self._u_flip(index_keys);
            var uv_flip_keys = self._v_flip(u_flip_keys);
            self.set_equivalent_face([u_index, v_index], uv_flip_keys, face, __kwargtrans__(kwargs));
        });
    }
});
//# sourceMappingURL=tessagon.core.tile.map
//# sourceMappingURL=tessagon.core.tile.js.map