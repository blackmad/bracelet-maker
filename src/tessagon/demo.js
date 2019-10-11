// Transcrypt'ed from Python, 2019-10-10 22:21:01
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {ALL} from './tessagon.core.tessagon_discovery.js';
import {plane} from './tessagon.misc.shapes.js';
import {ListAdaptor} from './tessagon.adaptors.list_adaptor.js';
import {HexTessagon} from './tessagon.types.hex_tessagon.js';
var __name__ = '__main__';
export var makeTesselation = function (u_range_lo, u_range_hi, v_range_lo, v_range_hi, u_num, v_num) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u_range_lo': var u_range_lo = __allkwargs0__ [__attrib0__]; break;
					case 'u_range_hi': var u_range_hi = __allkwargs0__ [__attrib0__]; break;
					case 'v_range_lo': var v_range_lo = __allkwargs0__ [__attrib0__]; break;
					case 'v_range_hi': var v_range_hi = __allkwargs0__ [__attrib0__]; break;
					case 'u_num': var u_num = __allkwargs0__ [__attrib0__]; break;
					case 'v_num': var v_num = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var options = dict ({'function': plane, 'u_range': [u_range_lo, u_range_hi], 'v_range': [v_range_lo, v_range_hi], 'u_num': u_num, 'v_num': v_num, 'u_cyclic': false, 'v_cyclic': false, 'adaptor_class': ListAdaptor});
	var tessagon = HexTessagon (__kwargtrans__ (options));
	var bmesh = tessagon.create_mesh ();
	return bmesh;
};
export var getAllTesselationNames = function () {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
			}
		}
	}
	else {
	}
	return (function () {
		var __accu0__ = [];
		for (var x of ALL) {
			__accu0__.append (x.__name__);
		}
		return __accu0__;
	}) ();
};
export var getTesselationFromName = function (py_name) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'py_name': var py_name = __allkwargs0__ [__attrib0__]; break;
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
				__accu0__.append (x);
			}
		}
		return __accu0__;
	}) () [0];
};
export var makeTesselationFromName = function (py_name, u_range_lo, u_range_hi, v_range_lo, v_range_hi, u_num, v_num) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'py_name': var py_name = __allkwargs0__ [__attrib0__]; break;
					case 'u_range_lo': var u_range_lo = __allkwargs0__ [__attrib0__]; break;
					case 'u_range_hi': var u_range_hi = __allkwargs0__ [__attrib0__]; break;
					case 'v_range_lo': var v_range_lo = __allkwargs0__ [__attrib0__]; break;
					case 'v_range_hi': var v_range_hi = __allkwargs0__ [__attrib0__]; break;
					case 'u_num': var u_num = __allkwargs0__ [__attrib0__]; break;
					case 'v_num': var v_num = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var options = dict ({'function': plane, 'u_range': [u_range_lo, u_range_hi], 'v_range': [v_range_lo, v_range_hi], 'u_num': u_num, 'v_num': v_num, 'u_cyclic': false, 'v_cyclic': false, 'adaptor_class': ListAdaptor});
	var tesselator = getTesselationFromName (py_name);
	var tessagon = tesselator (__kwargtrans__ (options));
	var bmesh = tessagon.create_mesh ();
	return bmesh;
};
print (ALL);

//# sourceMappingURL=demo.map