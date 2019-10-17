// Transcrypt'ed from Python, 2019-10-15 14:58:56
import { __kwargtrans__, dict } from './org.transcrypt.__runtime__.js';
import { ALL } from './tessagon.core.tessagon_discovery.js';
import { plane } from './tessagon.misc.shapes.js';
import { ListAdaptor } from './tessagon.adaptors.list_adaptor.js';
var __name__ = '__main__';
export var getAllTesselationNames = function () {
    if (arguments.length) {
        var __ilastarg0__ = arguments.length - 1;
        if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
            var __allkwargs0__ = arguments[__ilastarg0__--];
            for (var __attrib0__ in __allkwargs0__) {
            }
        }
    }
    else {
    }
    return (function () {
        var __accu0__ = [];
        for (var x of ALL) {
            __accu0__.append(x.__name__);
        }
        return __accu0__;
    })();
};
export var getTesselationFromName = function (py_name) {
    if (arguments.length) {
        var __ilastarg0__ = arguments.length - 1;
        if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
            var __allkwargs0__ = arguments[__ilastarg0__--];
            for (var __attrib0__ in __allkwargs0__) {
                switch (__attrib0__) {
                    case 'py_name':
                        var py_name = __allkwargs0__[__attrib0__];
                        break;
                }
            }
        }
    }
    else {
    }
    return (function () {
        var __accu0__ = [];
        for (var x of ALL) {
            if (py_name == x.__name__) {
                __accu0__.append(x);
            }
        }
        return __accu0__;
    })()[0];
};
export var makeTesselationFromNameAndOptions = function (py_name, options) {
    if (arguments.length) {
        var __ilastarg0__ = arguments.length - 1;
        if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
            var __allkwargs0__ = arguments[__ilastarg0__--];
            for (var __attrib0__ in __allkwargs0__) {
                switch (__attrib0__) {
                    case 'py_name':
                        var py_name = __allkwargs0__[__attrib0__];
                        break;
                    case 'options':
                        var options = __allkwargs0__[__attrib0__];
                        break;
                }
            }
        }
    }
    else {
    }
    var tesselator = getTesselationFromName(py_name);
    var tessagon = tesselator(__kwargtrans__(options));
    var bmesh = tessagon.create_mesh();
    return bmesh;
};
export var makeTesselationFromName = function (py_name, u_range_lo, u_range_hi, v_range_lo, v_range_hi, u_num, v_num, rot_factor) {
    if (arguments.length) {
        var __ilastarg0__ = arguments.length - 1;
        if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
            var __allkwargs0__ = arguments[__ilastarg0__--];
            for (var __attrib0__ in __allkwargs0__) {
                switch (__attrib0__) {
                    case 'py_name':
                        var py_name = __allkwargs0__[__attrib0__];
                        break;
                    case 'u_range_lo':
                        var u_range_lo = __allkwargs0__[__attrib0__];
                        break;
                    case 'u_range_hi':
                        var u_range_hi = __allkwargs0__[__attrib0__];
                        break;
                    case 'v_range_lo':
                        var v_range_lo = __allkwargs0__[__attrib0__];
                        break;
                    case 'v_range_hi':
                        var v_range_hi = __allkwargs0__[__attrib0__];
                        break;
                    case 'u_num':
                        var u_num = __allkwargs0__[__attrib0__];
                        break;
                    case 'v_num':
                        var v_num = __allkwargs0__[__attrib0__];
                        break;
                    case 'rot_factor':
                        var rot_factor = __allkwargs0__[__attrib0__];
                        break;
                }
            }
        }
    }
    else {
    }
    var options = dict({ 'function': plane, 'u_range': [u_range_lo, u_range_hi], 'v_range': [v_range_lo, v_range_hi], 'u_num': u_num, 'v_num': v_num, 'u_cyclic': false, 'v_cyclic': false, 'adaptor_class': ListAdaptor, 'rot_factor': rot_factor });
    return makeTesselationFromNameAndOptions(py_name, options);
    var tesselator = getTesselationFromName(py_name);
    var tessagon = tesselator(__kwargtrans__(options));
    var bmesh = tessagon.create_mesh();
    return bmesh;
};
//# sourceMappingURL=js-entry.map
//# sourceMappingURL=js-entry.js.map