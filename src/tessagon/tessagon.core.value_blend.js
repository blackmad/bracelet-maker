// Transcrypt'ed from Python, 2019-10-10 22:43:54
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'tessagon.core.value_blend';
export var ValueBlend =  __class__ ('ValueBlend', [object], {
	__module__: __name__,
	get _init_corners () {return __get__ (this, function (self) {
		var kwargs = dict ();
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
					}
				}
				delete kwargs.__kwargtrans__;
			}
		}
		else {
		}
		if (__in__ ('corners', kwargs)) {
			self.corners = kwargs ['corners'];
			if (len (self.corners) != 4 || any ((function () {
				var __accu0__ = [];
				for (var v of self.corners) {
					__accu0__.append (len (v) != 2);
				}
				return py_iter (__accu0__);
			}) ())) {
				var __except0__ = ValueError ("corner should be a list of four tuples, set either option 'corners' or options 'u_range' and 'v_range'");
				__except0__.__cause__ = null;
				throw __except0__;
			}
		}
		else if (__in__ ('u_range', kwargs) && __in__ ('v_range', kwargs)) {
			self.corners = [[kwargs ['u_range'] [0], kwargs ['v_range'] [0]], [kwargs ['u_range'] [1], kwargs ['v_range'] [0]], [kwargs ['u_range'] [0], kwargs ['v_range'] [1]], [kwargs ['u_range'] [1], kwargs ['v_range'] [1]]];
		}
		else {
			var __except0__ = ValueError ("Must set either option 'corners' or options 'u_range' and 'v_range'");
			__except0__.__cause__ = null;
			throw __except0__;
		}
	});},
	get _blend_tuples () {return __get__ (this, function (self, tuple1, tuple2, ratio) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'tuple1': var tuple1 = __allkwargs0__ [__attrib0__]; break;
						case 'tuple2': var tuple2 = __allkwargs0__ [__attrib0__]; break;
						case 'ratio': var ratio = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var out = [null, null];
		for (var i = 0; i < 2; i++) {
			out [i] = (1 - ratio) * tuple1 [i] + ratio * tuple2 [i];
		}
		return out;
	});},
	get blend () {return __get__ (this, function (self, ratio_u, ratio_v) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'ratio_u': var ratio_u = __allkwargs0__ [__attrib0__]; break;
						case 'ratio_v': var ratio_v = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var uv0 = self._blend_tuples (self.corners [0], self.corners [1], ratio_u);
		var uv1 = self._blend_tuples (self.corners [2], self.corners [3], ratio_u);
		return self._blend_tuples (uv0, uv1, ratio_v);
	});}
});

//# sourceMappingURL=tessagon.core.value_blend.map