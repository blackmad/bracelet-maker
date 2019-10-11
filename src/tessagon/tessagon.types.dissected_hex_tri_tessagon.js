// Transcrypt'ed from Python, 2019-10-10 23:37:03
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {TessagonMetadata} from './tessagon.core.tessagon_metadata.js';
import {Tessagon} from './tessagon.core.tessagon.js';
import {DissectedHexQuadTile} from './tessagon.types.dissected_hex_quad_tessagon.js';
var __name__ = 'tessagon.types.dissected_hex_tri_tessagon';
export var metadata = TessagonMetadata (__kwargtrans__ ({py_name: 'Hexagons Dissected with Triangles', classification: 'laves', shapes: ['triangles'], sides: [3]}));
export var DissectedHexTriTile =  __class__ ('DissectedHexTriTile', [DissectedHexQuadTile], {
	__module__: __name__,
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
		return dict ({'left': dict ({'top': dict ({'v_boundary': null, 'u_boundary': null, 'middle': null, 'center': null, 'interior1': null, 'interior2': null}), 'bottom': dict ({'v_boundary': null, 'u_boundary': null, 'middle': null, 'center': null, 'interior1': null, 'interior2': null})}), 'right': dict ({'top': dict ({'v_boundary': null, 'u_boundary': null, 'middle': null, 'center': null, 'interior1': null, 'interior2': null}), 'bottom': dict ({'v_boundary': null, 'u_boundary': null, 'middle': null, 'center': null, 'interior1': null, 'interior2': null})})});
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
		self.add_face (['left', 'top', 'v_boundary'], [['left', 'top', 'corner'], ['center', 'top', 'v_boundary'], ['center', 'top', 'interior']]);
		self.add_face (['left', 'top', 'interior1'], [['left', 'top', 'corner'], ['center', 'top', 'interior'], ['left', 'top', 'interior']]);
		self.add_face (['left', 'top', 'u_boundary'], [['left', 'top', 'corner'], ['left', 'top', 'interior'], ['left', 'top', 'u_boundary']]);
		self.add_face (['left', 'top', 'middle'], [['center', 'middle'], ['left', 'middle'], ['left', 'top', 'u_boundary']]);
		self.add_face (['left', 'top', 'interior2'], [['left', 'top', 'interior'], ['center', 'middle'], ['left', 'top', 'u_boundary']]);
		self.add_face (['left', 'top', 'center'], [['center', 'middle'], ['left', 'top', 'interior'], ['center', 'top', 'interior']]);
	});}
});
export var DissectedHexTriTessagon =  __class__ ('DissectedHexTriTessagon', [Tessagon], {
	__module__: __name__,
	tile_class: DissectedHexTriTile,
	metadata: metadata
});

//# sourceMappingURL=tessagon.types.dissected_hex_tri_tessagon.map