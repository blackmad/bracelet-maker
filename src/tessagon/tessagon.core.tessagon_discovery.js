// Transcrypt'ed from Python, 2019-10-10 22:43:54
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Penta2Tessagon} from './tessagon.types.penta2_tessagon.js';
import {PentaTessagon} from './tessagon.types.penta_tessagon.js';
import {DissectedHexTriTessagon} from './tessagon.types.dissected_hex_tri_tessagon.js';
import {DissectedHexQuadTessagon} from './tessagon.types.dissected_hex_quad_tessagon.js';
import {DissectedTriangleTessagon} from './tessagon.types.dissected_triangle_tessagon.js';
import {DodecaTriTessagon} from './tessagon.types.dodeca_tri_tessagon.js';
import {SquareTri2Tessagon} from './tessagon.types.square_tri2_tessagon.js';
import {DissectedSquareTessagon} from './tessagon.types.dissected_square_tessagon.js';
import {ZigZagTessagon} from './tessagon.types.zig_zag_tessagon.js';
import {HexBigTriTessagon} from './tessagon.types.hex_big_tri_tessagon.js';
import {FloretTessagon} from './tessagon.types.floret_tessagon.js';
import {WeaveTessagon} from './tessagon.types.weave_tessagon.js';
import {SquareTriTessagon} from './tessagon.types.square_tri_tessagon.js';
import {DodecaTessagon} from './tessagon.types.dodeca_tessagon.js';
import {BrickTessagon} from './tessagon.types.brick_tessagon.js';
import {PythagoreanTessagon} from './tessagon.types.pythagorean_tessagon.js';
import {SquareTessagon} from './tessagon.types.square_tessagon.js';
import {HexSquareTriTessagon} from './tessagon.types.hex_square_tri_tessagon.js';
import {HexTriTessagon} from './tessagon.types.hex_tri_tessagon.js';
import {RhombusTessagon} from './tessagon.types.rhombus_tessagon.js';
import {OctoTessagon} from './tessagon.types.octo_tessagon.js';
import {TriTessagon} from './tessagon.types.tri_tessagon.js';
import {HexTessagon} from './tessagon.types.hex_tessagon.js';
var __name__ = 'tessagon.core.tessagon_discovery';
export var ALL = [SquareTessagon, HexTessagon, TriTessagon, OctoTessagon, HexTriTessagon, HexSquareTriTessagon, DodecaTessagon, SquareTriTessagon, SquareTri2Tessagon, DodecaTriTessagon, RhombusTessagon, FloretTessagon, DissectedSquareTessagon, DissectedTriangleTessagon, DissectedHexQuadTessagon, DissectedHexTriTessagon, PentaTessagon, Penta2Tessagon, PythagoreanTessagon, BrickTessagon, WeaveTessagon, HexBigTriTessagon, ZigZagTessagon];
export var TessagonDiscovery =  __class__ ('TessagonDiscovery', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
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
		self.classes = kwargs.py_get ('classes', ALL);
	});},
	get count () {return __get__ (this, function (self) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		return len (self.classes);
	});},
	get to_list () {return __get__ (this, function (self) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		return self.classes;
	});},
	get inverse () {return __get__ (this, function (self) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var other_classes = list (set (ALL) - set (self.classes));
		return TessagonDiscovery (__kwargtrans__ ({classes: other_classes}));
	});},
	get __add__ () {return __get__ (this, function (self, other) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'other': var other = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var new_classes = list (set (self.classes) | set (other.classes));
		return TessagonDiscovery (__kwargtrans__ ({classes: new_classes}));
	});},
	get __sub__ () {return __get__ (this, function (self, other) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'other': var other = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var new_classes = list (set (self.classes) - set (other.classes));
		return TessagonDiscovery (__kwargtrans__ ({classes: new_classes}));
	});},
	get with_color_patterns () {return __get__ (this, function (self) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
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
			if (klass.metadata.has_color_patterns ()) {
				results.append (klass);
			}
		}
		return TessagonDiscovery (__kwargtrans__ ({classes: results}));
	});},
	get with_classification () {return __get__ (this, function (self, classification) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'classification': var classification = __allkwargs0__ [__attrib0__]; break;
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
			if (klass.metadata.has_classification (classification)) {
				results.append (klass);
			}
		}
		return TessagonDiscovery (__kwargtrans__ ({classes: results}));
	});}
});

//# sourceMappingURL=tessagon.core.tessagon_discovery.map