// Transcrypt'ed from Python, 2019-10-10 23:37:04
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {TessagonMetadata} from './tessagon.core.tessagon_metadata.js';
import {Tessagon} from './tessagon.core.tessagon.js';
import {Tile} from './tessagon.core.tile.js';
var __name__ = 'tessagon.types.zig_zag_tessagon';
export var metadata = TessagonMetadata (__kwargtrans__ ({py_name: 'Zig-Zag', classification: 'non_edge', shapes: ['rectangles'], sides: [4]}));
export var ZigZagTile =  __class__ ('ZigZagTile', [Tile], {
	__module__: __name__,
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
		return dict ({1: dict ({1: null, 2: null, 3: null, 4: null, 5: null}), 2: dict ({1: null, 2: null, 3: null, 4: null, 5: null}), 3: dict ({1: null, 2: null, 3: null, 4: null, 5: null}), 4: dict ({1: null, 2: null, 3: null, 4: null, 5: null}), 5: dict ({1: null, 2: null, 3: null, 4: null, 5: null})});
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
		return dict ({1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null});
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
		var c = dict ({1: 0.0, 2: 1 / 4.0, 3: 2 / 4.0, 4: 3 / 4.0, 5: 1.0});
		for (var col of self.verts.py_keys ()) {
			for (var row of self.verts [col].py_keys ()) {
				if (col == 5) {
					if (!(self.get_neighbor_tile (['right']))) {
						if (!(self.get_neighbor_tile (['top']))) {
							if (row == 5) {
								continue;
							}
							if (row == 4) {
								continue;
							}
						}
						if (!(self.get_neighbor_tile (['bottom']))) {
							if (row == 1) {
								continue;
							}
						}
					}
				}
				var vert = self.add_vert ([col, row], c [col], c [row]);
				if (col == 1) {
					self.set_equivalent_vert (['left'], [5, row], vert);
					if (row == 5) {
						self.set_equivalent_vert (['left', 'top'], [5, 1], vert);
					}
					else if (row == 1) {
						self.set_equivalent_vert (['left', 'bottom'], [5, 5], vert);
					}
				}
				else if (col == 5) {
					self.set_equivalent_vert (['right'], [1, row], vert);
					if (row == 5) {
						self.set_equivalent_vert (['right', 'top'], [1, 1], vert);
					}
					else if (row == 1) {
						self.set_equivalent_vert (['right', 'bottom'], [1, 5], vert);
					}
				}
				if (row == 5) {
					self.set_equivalent_vert (['top'], [col, 1], vert);
				}
				else if (row == 1) {
					self.set_equivalent_vert (['bottom'], [col, 5], vert);
				}
			}
		}
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
		self.add_face (1, [[1, 5], [1, 4], [2, 4], [3, 4], [3, 5], [2, 5]]);
		self.add_face (2, [[3, 5], [3, 4], [3, 3], [4, 3], [4, 4], [4, 5]]);
		var face = self.add_face (3, [[4, 5], [4, 4], [5, 4], [5, 5], [['top'], [5, 2]], [['top'], [4, 2]]]);
		self.set_equivalent_face (['top'], 10, face);
		var face = self.add_face (4, [[1, 3], [2, 3], [2, 4], [1, 4], [['left'], [4, 4]], [['left'], [4, 3]]]);
		self.set_equivalent_face (['left'], 6, face);
		self.add_face (5, [[3, 2], [3, 3], [3, 4], [2, 4], [2, 3], [2, 2]]);
		var face = self.add_face (6, [[5, 4], [4, 4], [4, 3], [5, 3], [['right'], [2, 3]], [['right'], [2, 4]]]);
		self.set_equivalent_face (['right'], 4, face);
		self.add_face (7, [[2, 1], [2, 2], [2, 3], [1, 3], [1, 2], [1, 1]]);
		self.add_face (8, [[5, 2], [5, 3], [4, 3], [3, 3], [3, 2], [4, 2]]);
		self.add_face (9, [[4, 1], [4, 2], [3, 2], [2, 2], [2, 1], [3, 1]]);
		var face = self.add_face (10, [[5, 1], [5, 2], [4, 2], [4, 1], [['bottom'], [4, 4]], [['bottom'], [5, 4]]]);
		self.set_equivalent_face (['bottom'], 3, face);
	});}
});
export var ZigZagTessagon =  __class__ ('ZigZagTessagon', [Tessagon], {
	__module__: __name__,
	tile_class: ZigZagTile,
	metadata: metadata
});

//# sourceMappingURL=tessagon.types.zig_zag_tessagon.map