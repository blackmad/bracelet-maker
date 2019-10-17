// Transcrypt'ed from Python, 2019-10-15 14:58:57
import { ValueError, __class__, __get__, __in__, any, dict, len, object, py_iter } from './org.transcrypt.__runtime__.js';
var __name__ = 'tessagon.core.value_blend';
export var ValueBlend = __class__('ValueBlend', [object], {
    __module__: __name__,
    get _init_corners() {
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
            if (__in__('corners', kwargs)) {
                self.corners = kwargs['corners'];
                if (len(self.corners) != 4 || any((function () {
                    var __accu0__ = [];
                    for (var v of self.corners) {
                        __accu0__.append(len(v) != 2);
                    }
                    return py_iter(__accu0__);
                })())) {
                    var __except0__ = ValueError("corner should be a list of four tuples, set either option 'corners' or options 'u_range' and 'v_range'");
                    __except0__.__cause__ = null;
                    throw __except0__;
                }
            }
            else if (__in__('u_range', kwargs) && __in__('v_range', kwargs)) {
                self.corners = [[kwargs['u_range'][0], kwargs['v_range'][0]], [kwargs['u_range'][1], kwargs['v_range'][0]], [kwargs['u_range'][0], kwargs['v_range'][1]], [kwargs['u_range'][1], kwargs['v_range'][1]]];
            }
            else {
                var __except0__ = ValueError("Must set either option 'corners' or options 'u_range' and 'v_range'");
                __except0__.__cause__ = null;
                throw __except0__;
            }
        });
    },
    get _blend_tuples() {
        return __get__(this, function (self, tuple1, tuple2, ratio) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'tuple1':
                                var tuple1 = __allkwargs0__[__attrib0__];
                                break;
                            case 'tuple2':
                                var tuple2 = __allkwargs0__[__attrib0__];
                                break;
                            case 'ratio':
                                var ratio = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            var out = [null, null];
            for (var i = 0; i < 2; i++) {
                out[i] = (1 - ratio) * tuple1[i] + ratio * tuple2[i];
            }
            return out;
        });
    },
    get blend() {
        return __get__(this, function (self, ratio_u, ratio_v) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'ratio_u':
                                var ratio_u = __allkwargs0__[__attrib0__];
                                break;
                            case 'ratio_v':
                                var ratio_v = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            var uv0 = self._blend_tuples(self.corners[0], self.corners[1], ratio_u);
            var uv1 = self._blend_tuples(self.corners[2], self.corners[3], ratio_u);
            return self._blend_tuples(uv0, uv1, ratio_v);
        });
    }
});
//# sourceMappingURL=tessagon.core.value_blend.map
//# sourceMappingURL=tessagon.core.value_blend.js.map