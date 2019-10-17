// Transcrypt'ed from Python, 2019-10-15 14:58:57
import { ValueError, __class__, __get__, __in__, __kwargtrans__, __mod__, dict, float, tuple } from './org.transcrypt.__runtime__.js';
import { ValueBlend } from './tessagon.core.value_blend.js';
var __name__ = 'tessagon.core.tile_generator';
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
export var TileGenerator = __class__('TileGenerator', [ValueBlend], {
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
            self.tessagon = tessagon;
            self.corners = null;
            self._init_corners(__kwargtrans__(kwargs));
            var __left0__ = null;
            self.u_num = __left0__;
            self.v_num = __left0__;
            self.u_cyclic = true;
            self.v_cyclic = true;
            self.u_twist = false;
            self.v_twist = false;
            self.u_phase = 0.0;
            self.v_phase = 0.0;
            self.u_shear = 0.0;
            self.v_shear = 0.0;
            if (__in__('u_num', kwargs)) {
                self.u_num = kwargs['u_num'];
            }
            if (__in__('v_num', kwargs)) {
                self.v_num = kwargs['v_num'];
            }
            if (!(self.u_num) || !(self.v_num)) {
                var __except0__ = ValueError('Make sure u_num and v_num intervals are set');
                __except0__.__cause__ = null;
                throw __except0__;
            }
            if (__in__('u_cyclic', kwargs)) {
                self.u_cyclic = kwargs['u_cyclic'];
            }
            if (__in__('u_phase', kwargs) && kwargs['u_phase']) {
                self.u_phase = kwargs['u_phase'];
            }
            if (__in__('u_shear', kwargs) && kwargs['u_shear']) {
                self.u_shear = kwargs['u_shear'];
            }
            if (__in__('v_twist', kwargs)) {
                self.v_twist = kwargs['v_twist'];
            }
            if (__in__('v_cyclic', kwargs)) {
                self.v_cyclic = kwargs['v_cyclic'];
            }
            if (__in__('v_phase', kwargs) && kwargs['v_phase']) {
                self.v_phase = kwargs['v_phase'];
            }
            if (__in__('v_shear', kwargs) && kwargs['v_shear']) {
                self.v_shear = kwargs['v_shear'];
            }
            if (__in__('u_twist', kwargs)) {
                self.u_twist = kwargs['u_twist'];
            }
            self.id_prefix = self.tessagon.__class__.__name__;
            if (__in__('id_prefix', kwargs)) {
                self.id_prefix = kwargs['id_prefix'];
            }
            self.fingerprint_offset = kwargs.py_get('fingerprint_offset') || null;
            self.color_pattern = kwargs.py_get('color_pattern') || null;
        });
    },
    get initialize_tiles() {
        return __get__(this, function (self, tile_class) {
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
                            case 'tile_class':
                                var tile_class = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            var tiles = (function () {
                var __accu0__ = [];
                for (var j = 0; j < self.u_num; j++) {
                    __accu0__.append((function () {
                        var __accu1__ = [];
                        for (var i = 0; i < self.v_num; i++) {
                            __accu1__.append(null);
                        }
                        return __accu1__;
                    })());
                }
                return __accu0__;
            })();
            for (var u = 0; u < self.u_num; u++) {
                var u_ratio0 = float(u) / self.u_num;
                var u_ratio1 = float(u + 1) / self.u_num;
                var v_shear0 = u * self.v_shear;
                var v_shear1 = (u + 1) * self.v_shear;
                for (var v = 0; v < self.v_num; v++) {
                    var v_ratio0 = float(v) / self.v_num;
                    var v_ratio1 = float(v + 1) / self.v_num;
                    var u_shear0 = v * self.u_shear;
                    var u_shear1 = (v + 1) * self.u_shear;
                    var corners = [self.blend((u_ratio0 + u_shear0) + self.u_phase, (v_ratio0 + v_shear0) + self.v_phase), self.blend((u_ratio1 + u_shear0) + self.u_phase, (v_ratio0 + v_shear1) + self.v_phase), self.blend((u_ratio0 + u_shear1) + self.u_phase, (v_ratio1 + v_shear0) + self.v_phase), self.blend((u_ratio1 + u_shear1) + self.u_phase, (v_ratio1 + v_shear1) + self.v_phase)];
                    var extra_args = dict({ 'corners': corners, 'fingerprint': [u, v] });
                    if (self.fingerprint_offset) {
                        extra_args['fingerprint'][0] += self.fingerprint_offset[0];
                        extra_args['fingerprint'][1] += self.fingerprint_offset[1];
                    }
                    if (self.id_prefix) {
                        extra_args['id'] = __mod__('%s[%d][%d]', tuple([self.id_prefix, u, v]));
                    }
                    if (self.color_pattern) {
                        extra_args['color_pattern'] = self.color_pattern;
                    }
                    tiles[u][v] = tile_class(self.tessagon, __kwargtrans__(Merge(kwargs, extra_args)));
                }
            }
            return tiles;
        });
    },
    get initialize_neighbors() {
        return __get__(this, function (self, tiles) {
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
                            case 'tiles':
                                var tiles = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            for (var u = 0; u < self.u_num; u++) {
                var u_prev = __mod__(u - 1, self.u_num);
                var u_next = __mod__(u + 1, self.u_num);
                for (var v = 0; v < self.v_num; v++) {
                    var v_prev = __mod__(v - 1, self.v_num);
                    var v_next = __mod__(v + 1, self.v_num);
                    var tile = tiles[u][v];
                    if (!(self.u_cyclic) && u == 0) {
                        var left = null;
                    }
                    else if (self.v_twist && u == 0) {
                        var left = tiles[u_prev][(self.v_num - v) - 1];
                        tile.twist['left'] = true;
                    }
                    else {
                        var left = tiles[u_prev][v];
                    }
                    if (!(self.v_cyclic) && v == self.v_num - 1) {
                        var top = null;
                    }
                    else if (self.u_twist && v == self.v_num - 1) {
                        var top = tiles[(self.u_num - u) - 1][v_next];
                        tile.twist['top'] = true;
                    }
                    else {
                        var top = tiles[u][v_next];
                    }
                    if (!(self.u_cyclic) && u == self.u_num - 1) {
                        var right = null;
                    }
                    else if (self.v_twist && u == self.u_num - 1) {
                        var right = tiles[u_next][(self.v_num - v) - 1];
                        tile.twist['right'] = true;
                    }
                    else {
                        var right = tiles[u_next][v];
                    }
                    if (!(self.v_cyclic) && v == 0) {
                        var bottom = null;
                    }
                    else if (self.u_twist && v == 0) {
                        var bottom = tiles[(self.u_num - u) - 1][v_prev];
                        tile.twist['bottom'] = true;
                    }
                    else {
                        var bottom = tiles[u][v_prev];
                    }
                    tile.set_neighbors(__kwargtrans__({ left: left, right: right, top: top, bottom: bottom }));
                }
            }
        });
    }
});
//# sourceMappingURL=tessagon.core.tile_generator.map
//# sourceMappingURL=tessagon.core.tile_generator.js.map