// Transcrypt'ed from Python, 2019-10-15 14:58:58
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {cos, pi, sin, sqrt} from './math.js';
var __name__ = 'tessagon.misc.shapes';
export var plane = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return [u, v, 0];
};
export var other_plane = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return [v, u, 0];
};
export var general_torus = function (r1, r2, u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'r1': var r1 = __allkwargs0__ [__attrib0__]; break;
					case 'r2': var r2 = __allkwargs0__ [__attrib0__]; break;
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var x = (r1 + r2 * cos ((v * 2) * pi)) * cos ((u * 2) * pi);
	var y = (r1 + r2 * cos ((v * 2) * pi)) * sin ((u * 2) * pi);
	var z = r2 * sin ((v * 2) * pi);
	return [x, y, z];
};
export var normalize_value = function (v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	if (v < 0.0) {
		while (v < 0.0) {
			v++;
		}
	}
	else {
		while (v > 1.0) {
			v--;
		}
	}
	return v;
};
export var warp_var = function (v, factor) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
					case 'factor': var factor = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var v = normalize_value (v);
	var h = 2 * (v - 0.5);
	var i = h + factor * Math.pow (h, 3);
	return 0.5 * (1.0 + i / (1.0 + factor));
};
export var torus = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var r1 = 5.0;
	var r2 = 1.0;
	return general_torus (r1, r2, u, warp_var (v, 0.2));
};
export var other_torus = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return torus (v, u);
};
export var general_cylinder = function (r, h, u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'r': var r = __allkwargs0__ [__attrib0__]; break;
					case 'h': var h = __allkwargs0__ [__attrib0__]; break;
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var x = r * cos ((u * 2) * pi);
	var y = r * sin ((u * 2) * pi);
	var z = h * (v - 0.5);
	return [x, y, z];
};
export var cylinder = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var r = 5.0;
	var h = 3.5;
	return general_cylinder (r, h, u, v);
};
export var other_cylinder = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return cylinder (v, u);
};
export var general_paraboloid = function (scale1, scale2, displace, u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'scale1': var scale1 = __allkwargs0__ [__attrib0__]; break;
					case 'scale2': var scale2 = __allkwargs0__ [__attrib0__]; break;
					case 'displace': var displace = __allkwargs0__ [__attrib0__]; break;
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return [scale1 * u, scale1 * v, displace + scale2 * (Math.pow (u, 2) + Math.pow (v, 2))];
};
export var paraboloid = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return general_paraboloid (4, 3, -(3), u, v);
};
export var general_one_sheet_hyperboloid = function (scale1, scale2, u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'scale1': var scale1 = __allkwargs0__ [__attrib0__]; break;
					case 'scale2': var scale2 = __allkwargs0__ [__attrib0__]; break;
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var c = scale1 * sqrt (1 + Math.pow (u, 2));
	var v1 = (2 * pi) * v;
	var x = c * cos (v1);
	var y = c * sin (v1);
	var z = scale2 * u;
	return [x, y, z];
};
export var one_sheet_hyperboloid = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return general_one_sheet_hyperboloid (3, 2, u, v);
};
export var general_ellipsoid = function (r1, r2, r3, u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'r1': var r1 = __allkwargs0__ [__attrib0__]; break;
					case 'r2': var r2 = __allkwargs0__ [__attrib0__]; break;
					case 'r3': var r3 = __allkwargs0__ [__attrib0__]; break;
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var u1 = (2 * pi) * u;
	var v1 = pi * normalize_value (warp_var (v + 0.5, 0.8) - 0.5);
	var sinv1 = sin (v1);
	return [(r1 * cos (u1)) * sinv1, (r2 * sin (u1)) * sinv1, r3 * cos (v1)];
};
export var sphere = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return general_ellipsoid (4, 4, 4, u, v);
};
export var general_mobius = function (r, h, u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'r': var r = __allkwargs0__ [__attrib0__]; break;
					case 'h': var h = __allkwargs0__ [__attrib0__]; break;
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var offset = (h * (v - 0.5)) * sin (u * pi);
	var x = (r + offset) * cos ((u * 2) * pi);
	var y = (r + offset) * sin ((u * 2) * pi);
	var z = (h * (v - 0.5)) * cos (u * pi);
	return [x, y, z];
};
export var mobius = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var r = 5.0;
	var h = 2.0;
	return general_mobius (r, h, v, u);
};
export var other_mobius = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return mobius (v, u);
};
export var general_klein = function (scale, u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'scale': var scale = __allkwargs0__ [__attrib0__]; break;
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	var u1 = (2 * pi) * normalize_value (warp_var (u + 0.5, 0.6) - 0.5);
	var v1 = (2 * pi) * normalize_value (v + 0.25);
	var c1 = cos (u1);
	var c2 = sin (u1);
	var r = 4.0 - 2.0 * c1;
	if (u1 <= pi) {
		var x = (6 * c1) * (1.0 + c2) + (r * c1) * cos (v1);
		var y = 16 * c2 + (r * c2) * cos (v1);
	}
	else {
		var x = (6 * c1) * (1.0 + c2) + r * cos (v1 + pi);
		var y = 16 * c2;
	}
	var z = r * sin (v1);
	return [scale * x, scale * y, scale * z];
};
export var klein = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return general_klein (0.25, u, v);
};
export var other_klein = function (u, v) {
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'u': var u = __allkwargs0__ [__attrib0__]; break;
					case 'v': var v = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	else {
	}
	return general_klein (0.25, v, u);
};

//# sourceMappingURL=tessagon.misc.shapes.map