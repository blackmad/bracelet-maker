// Transcrypt'ed from Python, 2019-10-10 22:21:03
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {TessagonMetadata} from './tessagon.core.tessagon_metadata.js';
import {Tessagon} from './tessagon.core.tessagon.js';
import {Tile} from './tessagon.core.tile.js';
var __name__ = 'tessagon.types.weave_tessagon';
export var metadata = TessagonMetadata (__kwargtrans__ ({py_name: 'Weave', classification: 'non_edge', shapes: ['quads', 'rectangles'], sides: [4]}));
export var WeaveTile =  __class__ ('WeaveTile', [Tile], {
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
		__super__ (WeaveTile, '__init__') (self, tessagon, __kwargtrans__ (kwargs));
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
		return dict ({'top': dict ({'left': dict ({'u_inner': dict ({'v_inner': null, 'v_outer': null}), 'u_outer': dict ({'v_inner': null, 'v_outer': null})}), 'right': dict ({'u_inner': dict ({'v_inner': null, 'v_outer': null}), 'u_outer': dict ({'v_inner': null, 'v_outer': null})})}), 'bottom': dict ({'left': dict ({'u_inner': dict ({'v_inner': null, 'v_outer': null}), 'u_outer': dict ({'v_inner': null, 'v_outer': null})}), 'right': dict ({'u_inner': dict ({'v_inner': null, 'v_outer': null}), 'u_outer': dict ({'v_inner': null, 'v_outer': null})})})});
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
		return dict ({'square': dict ({'top': dict ({'left': null, 'right': null}), 'bottom': dict ({'left': null, 'right': null})}), 'oct': dict ({'top': dict ({'left': null, 'center': null, 'right': null}), 'middle': dict ({'left': null, 'center': null, 'right': null}), 'bottom': dict ({'left': null, 'center': null, 'right': null})})});
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
		var u0 = 1.0 / 8.0;
		var u1 = 3.0 / 8.0;
		var v0 = 5.0 / 8.0;
		var v1 = 7.0 / 8.0;
		self.add_vert (['top', 'left', 'u_inner', 'v_inner'], u1, v0);
		self.add_vert (['top', 'left', 'u_inner', 'v_outer'], u1, v1);
		self.add_vert (['top', 'left', 'u_outer', 'v_inner'], u0, v0);
		self.add_vert (['top', 'left', 'u_outer', 'v_outer'], u0, v1);
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
		self.add_face (['square', 'top', 'left'], [['top', 'left', 'u_outer', 'v_outer'], ['top', 'left', 'u_inner', 'v_outer'], ['top', 'left', 'u_inner', 'v_inner'], ['top', 'left', 'u_outer', 'v_inner']], __kwargtrans__ ({face_type: 'square'}));
		self.add_face (['oct', 'middle', 'center'], [['top', 'left', 'u_outer', 'v_inner'], ['top', 'left', 'u_inner', 'v_inner'], ['top', 'right', 'u_inner', 'v_inner'], ['top', 'right', 'u_outer', 'v_inner'], ['bottom', 'right', 'u_outer', 'v_inner'], ['bottom', 'right', 'u_inner', 'v_inner'], ['bottom', 'left', 'u_inner', 'v_inner'], ['bottom', 'left', 'u_outer', 'v_inner']], __kwargtrans__ ({face_type: 'oct'}));
		self.add_face (['oct', 'top', 'left'], [['top', 'left', 'u_inner', 'v_outer'], ['top', 'left', 'u_outer', 'v_outer'], [['left'], ['top', 'right', 'u_outer', 'v_outer']], [['left'], ['top', 'right', 'u_inner', 'v_outer']], [['left', 'top'], ['bottom', 'right', 'u_inner', 'v_outer']], [['left', 'top'], ['bottom', 'right', 'u_outer', 'v_outer']], [['top'], ['bottom', 'left', 'u_outer', 'v_outer']], [['top'], ['bottom', 'left', 'u_inner', 'v_outer']]], __kwargtrans__ ({face_type: 'oct', corner: true}));
		self.add_face (['oct', 'middle', 'left'], [['top', 'left', 'u_outer', 'v_outer'], ['top', 'left', 'u_outer', 'v_inner'], ['bottom', 'left', 'u_outer', 'v_inner'], ['bottom', 'left', 'u_outer', 'v_outer'], [['left'], ['bottom', 'right', 'u_outer', 'v_outer']], [['left'], ['bottom', 'right', 'u_outer', 'v_inner']], [['left'], ['top', 'right', 'u_outer', 'v_inner']], [['left'], ['top', 'right', 'u_outer', 'v_outer']]], __kwargtrans__ ({face_type: 'oct', u_boundary: true}));
		self.add_face (['oct', 'top', 'center'], [['top', 'left', 'u_inner', 'v_outer'], ['top', 'left', 'u_inner', 'v_inner'], ['top', 'right', 'u_inner', 'v_inner'], ['top', 'right', 'u_inner', 'v_outer'], [['top'], ['bottom', 'right', 'u_inner', 'v_outer']], [['top'], ['bottom', 'right', 'u_inner', 'v_inner']], [['top'], ['bottom', 'left', 'u_inner', 'v_inner']], [['top'], ['bottom', 'left', 'u_inner', 'v_outer']]], __kwargtrans__ ({face_type: 'oct', v_boundary: true}));
	});}
});
export var WeaveTessagon =  __class__ ('WeaveTessagon', [Tessagon], {
	__module__: __name__,
	tile_class: WeaveTile,
	metadata: metadata
});

//# sourceMappingURL=tessagon.types.weave_tessagon.map