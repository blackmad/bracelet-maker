// Transcrypt'ed from Python, 2019-10-15 14:58:58
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {TessagonMetadata} from './tessagon.core.tessagon_metadata.js';
import {Tessagon} from './tessagon.core.tessagon.js';
import {Tile} from './tessagon.core.tile.js';
var __name__ = 'tessagon.types.hex_tri_tessagon';
export var metadata = TessagonMetadata (__kwargtrans__ ({py_name: 'Hexagons and Triangles', classification: 'archimedean', shapes: ['hexagons', 'triangles'], sides: [6, 3]}));
export var HexTriTile =  __class__ ('HexTriTile', [Tile], {
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
		__super__ (HexTriTile, '__init__') (self, tessagon, __kwargtrans__ (kwargs));
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
		return dict ({'top': null, 'left': dict ({'top': null, 'middle': null, 'bottom': null}), 'right': dict ({'top': null, 'middle': null, 'bottom': null}), 'bottom': null});
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
		return dict ({'center': dict ({'top': null, 'middle': null, 'bottom': null}), 'left': dict ({'top': dict ({'triangle': null, 'hexagon': null}), 'bottom': dict ({'triangle': null, 'hexagon': null})}), 'right': dict ({'top': dict ({'triangle': null, 'hexagon': null}), 'bottom': dict ({'triangle': null, 'hexagon': null})})});
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
		self.add_vert ('top', 0.5, 1, __kwargtrans__ ({v_boundary: true}));
		self.add_vert (['left', 'top'], 0.25, 0.75);
		self.add_vert (['left', 'middle'], 0, 0.5, __kwargtrans__ ({u_boundary: true}));
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
		self.add_face (['center', 'middle'], [['left', 'top'], ['left', 'middle'], ['left', 'bottom'], ['right', 'bottom'], ['right', 'middle'], ['right', 'top']], __kwargtrans__ ({face_type: 'hexagon'}));
		self.add_face (['center', 'top'], [['top'], ['left', 'top'], ['right', 'top']], __kwargtrans__ ({face_type: 'triangle'}));
		self.add_face (['left', 'top', 'triangle'], [['left', 'top'], ['left', 'middle'], [['left'], ['right', 'top']]], __kwargtrans__ ({face_type: 'triangle', u_boundary: true}));
		self.add_face (['left', 'top', 'hexagon'], [['top'], ['left', 'top'], [['left'], ['right', 'top']], [['left'], 'top'], [['left', 'top'], ['right', 'bottom']], [['top'], ['left', 'bottom']]], __kwargtrans__ ({face_type: 'hexagon', corner: true}));
	});}
});
export var HexTriTessagon =  __class__ ('HexTriTessagon', [Tessagon], {
	__module__: __name__,
	tile_class: HexTriTile,
	metadata: metadata
});

//# sourceMappingURL=tessagon.types.hex_tri_tessagon.map