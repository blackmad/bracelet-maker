// Transcrypt'ed from Python, 2019-10-10 23:37:02
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {RotateTileGenerator} from './tessagon.core.rotate_tile_generator.js';
import {GridTileGenerator} from './tessagon.core.grid_tile_generator.js';
var __name__ = 'tessagon.core.tessagon';
export var Tessagon =  __class__ ('Tessagon', [object], {
	__module__: __name__,
	tile_class: null,
	metadata: null,
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
		if (__in__ ('function', kwargs)) {
			self.f = kwargs ['function'];
		}
		else {
			var __except0__ = ValueError ('Must specify a function');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (__in__ ('tile_generator', kwargs)) {
			self.tile_generator = kwargs ['tile_generator'] (self, __kwargtrans__ (kwargs));
		}
		else if (__in__ ('rot_factor', kwargs)) {
			self.tile_generator = RotateTileGenerator (self, __kwargtrans__ (kwargs));
		}
		else {
			self.tile_generator = GridTileGenerator (self, __kwargtrans__ (kwargs));
		}
		self.post_process = null;
		if (__in__ ('post_process', kwargs)) {
			self.post_process = kwargs ['post_process'];
		}
		if (__in__ ('adaptor_class', kwargs)) {
			var adaptor_class = kwargs ['adaptor_class'];
			self.mesh_adaptor = adaptor_class (__kwargtrans__ (kwargs));
		}
		else {
			var __except0__ = ValueError ('Must provide a mesh adaptor class');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		self.color_pattern = kwargs.py_get ('color_pattern') || null;
		self.tiles = null;
		self.face_types = dict ({});
		self.vert_types = dict ({});
	});},
	get create_mesh () {return __get__ (this, function (self) {
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
		self._initialize_tiles ();
		self.mesh_adaptor.create_empty_mesh ();
		self._calculate_verts ();
		self._calculate_faces ();
		if (self.color_pattern) {
			self._calculate_colors ();
		}
		self.mesh_adaptor.finish_mesh ();
		if (self.post_process) {
			self.post_process (self);
		}
		return self.mesh_adaptor.get_mesh ();
	});},
	get inspect () {return __get__ (this, function (self) {
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
		print (__mod__ ('\n=== %s ===\n', self.__class__.__name__));
		for (var i = 0; i < len (self.tiles); i++) {
			self.tiles [i].inspect (__kwargtrans__ ({tile_number: i}));
		}
	});},
	get num_color_patterns () {return __getcm__ (this, function (cls) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'cls': var cls = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (cls.metadata === null) {
			return 0;
		}
		return cls.metadata.num_color_patterns ();
	});},
	get _initialize_tiles () {return __get__ (this, function (self) {
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
		self.tiles = self.tile_generator.create_tiles ();
	});},
	get _calculate_verts () {return __get__ (this, function (self) {
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
		for (var tile of self.tiles) {
			tile.calculate_verts ();
		}
	});},
	get _calculate_faces () {return __get__ (this, function (self) {
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
		for (var tile of self.tiles) {
			tile.calculate_faces ();
		}
	});},
	get _calculate_colors () {return __get__ (this, function (self) {
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
		self.mesh_adaptor.initialize_colors ();
		for (var tile of self.tiles) {
			tile.calculate_colors ();
		}
	});}
});

//# sourceMappingURL=tessagon.core.tessagon.map