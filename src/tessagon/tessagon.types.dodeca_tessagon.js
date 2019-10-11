// Transcrypt'ed from Python, 2019-10-10 23:37:04
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {TessagonMetadata} from './tessagon.core.tessagon_metadata.js';
import {Tessagon} from './tessagon.core.tessagon.js';
import {Tile} from './tessagon.core.tile.js';
import {sqrt} from './math.js';
var __name__ = 'tessagon.types.dodeca_tessagon';
export var metadata = TessagonMetadata (__kwargtrans__ ({py_name: 'Dodecagons, Hexagons, and Squares', classification: 'archimedean', shapes: ['dodecagons', 'hexagons', 'squares'], sides: [12, 6, 4]}));
export var DodecaTile =  __class__ ('DodecaTile', [Tile], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, tessagon) {
		var kwargs = dict ();
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'tessagon': var tessagon = __allkwargs0__ [__attrib0__]; break;
						default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
					}
				}
				delete kwargs.__kwargtrans__;
			}
		}
		else {
		}
		__super__ (DodecaTile, '__init__') (self, tessagon, __kwargtrans__ (kwargs));
		self.u_symmetric = true;
		self.v_symmetric = true;
	});},
	get init_verts () {return __get__ (this, function (self) {
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
		return dict ({'top': dict ({'left': dict ({'u_square': null, 'v_square': null, 'sq1': null, 'sq2': null, 'sq3': null, 'sq4': null}), 'right': dict ({'u_square': null, 'v_square': null, 'sq1': null, 'sq2': null, 'sq3': null, 'sq4': null})}), 'bottom': dict ({'left': dict ({'u_square': null, 'v_square': null, 'sq1': null, 'sq2': null, 'sq3': null, 'sq4': null}), 'right': dict ({'u_square': null, 'v_square': null, 'sq1': null, 'sq2': null, 'sq3': null, 'sq4': null})})});
	});},
	get init_faces () {return __get__ (this, function (self) {
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
		return dict ({'dodec': dict ({'top': dict ({'left': null, 'right': null}), 'bottom': dict ({'left': null, 'right': null}), 'middle': null}), 'hex': dict ({'top': dict ({'left': null, 'center': null, 'right': null}), 'bottom': dict ({'left': null, 'center': null, 'right': null})}), 'square': dict ({'top': dict ({'left': null, 'center': null, 'right': null}), 'bottom': dict ({'left': null, 'center': null, 'right': null}), 'middle': dict ({'left': null, 'right': null})})});
	});},
	get calculate_verts () {return __get__ (this, function (self) {
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
		var u_unit = 1.0 / (3.0 + sqrt (3));
		var u_h = (0.5 * sqrt (3)) * u_unit;
		var u1 = 0.5 * u_unit;
		var u2 = (0.5 - u1) - u_h;
		var u3 = 0.5 - u_unit;
		var u4 = 0.5 - u1;
		var v_unit = 1.0 / (3.0 * (1.0 + sqrt (3)));
		var v_h = (0.5 * sqrt (3)) * v_unit;
		var v1 = 1.0 - 0.5 * v_unit;
		var v2 = v1 - v_h;
		var v3 = (0.5 + 2 * v_h) + 0.5 * v_unit;
		var v4 = (0.5 + v_h) + v_unit;
		var v5 = (0.5 + v_h) + 0.5 * v_unit;
		var v6 = 0.5 + 0.5 * v_unit;
		self.add_vert (['top', 'left', 'v_square'], u4, v1);
		self.add_vert (['top', 'left', 'u_square'], u1, v6);
		self.add_vert (['top', 'left', 'sq1'], u2, v5);
		self.add_vert (['top', 'left', 'sq2'], u4, v4);
		self.add_vert (['top', 'left', 'sq3'], u1, v3);
		self.add_vert (['top', 'left', 'sq4'], u3, v2);
	});},
	get calculate_faces () {return __get__ (this, function (self) {
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
		self.add_face (['dodec', 'top', 'left'], [['top', 'left', 'v_square'], ['top', 'left', 'sq4'], ['top', 'left', 'sq3'], [['left'], ['top', 'right', 'sq3']], [['left'], ['top', 'right', 'sq4']], [['left'], ['top', 'right', 'v_square']], [['left', 'top'], ['bottom', 'right', 'v_square']], [['left', 'top'], ['bottom', 'right', 'sq4']], [['left', 'top'], ['bottom', 'right', 'sq3']], [['top'], ['bottom', 'left', 'sq3']], [['top'], ['bottom', 'left', 'sq4']], [['top'], ['bottom', 'left', 'v_square']]], __kwargtrans__ ({face_type: 'dodecagon', corner: true}));
		self.add_face (['dodec', 'middle'], [['top', 'left', 'u_square'], ['top', 'left', 'sq1'], ['top', 'left', 'sq2'], ['top', 'right', 'sq2'], ['top', 'right', 'sq1'], ['top', 'right', 'u_square'], ['bottom', 'right', 'u_square'], ['bottom', 'right', 'sq1'], ['bottom', 'right', 'sq2'], ['bottom', 'left', 'sq2'], ['bottom', 'left', 'sq1'], ['bottom', 'left', 'u_square']], __kwargtrans__ ({face_type: 'dodecagon'}));
		self.add_face (['square', 'top', 'center'], [['top', 'left', 'v_square'], ['top', 'right', 'v_square'], [['top'], ['bottom', 'right', 'v_square']], [['top'], ['bottom', 'left', 'v_square']]], __kwargtrans__ ({face_type: 'square', v_boundary: true}));
		self.add_face (['square', 'middle', 'left'], [['top', 'left', 'u_square'], ['bottom', 'left', 'u_square'], [['left'], ['bottom', 'right', 'u_square']], [['left'], ['top', 'right', 'u_square']]], __kwargtrans__ ({face_type: 'square', u_boundary: true}));
		self.add_face (['square', 'top', 'left'], [['top', 'left', 'sq1'], ['top', 'left', 'sq2'], ['top', 'left', 'sq4'], ['top', 'left', 'sq3']], __kwargtrans__ ({face_type: 'square'}));
		self.add_face (['hex', 'top', 'center'], [['top', 'left', 'sq2'], ['top', 'left', 'sq4'], ['top', 'left', 'v_square'], ['top', 'right', 'v_square'], ['top', 'right', 'sq4'], ['top', 'right', 'sq2']], __kwargtrans__ ({face_type: 'hexagon'}));
		self.add_face (['hex', 'top', 'left'], [['top', 'left', 'sq3'], ['top', 'left', 'sq1'], ['top', 'left', 'u_square'], [['left'], ['top', 'right', 'u_square']], [['left'], ['top', 'right', 'sq1']], [['left'], ['top', 'right', 'sq3']]], __kwargtrans__ ({face_type: 'hexagon', u_boundary: true}));
	});}
});
export var DodecaTessagon =  __class__ ('DodecaTessagon', [Tessagon], {
	__module__: __name__,
	tile_class: DodecaTile,
	metadata: metadata
});

//# sourceMappingURL=tessagon.types.dodeca_tessagon.map