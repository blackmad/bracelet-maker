// Transcrypt'ed from Python, 2019-10-10 23:37:04
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Tile} from './tessagon.core.tile.js';
import {Tessagon} from './tessagon.core.tessagon.js';
var __name__ = 'tessagon.core.stamp14_tessagon';
export var Stamp14 =  __class__ ('Stamp14', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, tile, i, reference_point) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'tile': var tile = __allkwargs0__ [__attrib0__]; break;
						case 'i': var i = __allkwargs0__ [__attrib0__]; break;
						case 'reference_point': var reference_point = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		self.tile = tile;
		self.neighbors = (function () {
			var __accu0__ = [];
			for (var i = 0; i < 6; i++) {
				__accu0__.append (null);
			}
			return __accu0__;
		}) ();
		self.verts = self.init_verts ();
		self.faces = self.init_faces ();
		self.reference_point = reference_point;
	});},
	get set_neighbor () {return __get__ (this, function (self, index, stamp) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'index': var index = __allkwargs0__ [__attrib0__]; break;
						case 'stamp': var stamp = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (self.neighbors [index]) {
			return ;
		}
		if (!(stamp)) {
			return ;
		}
		self.neighbors [index] = stamp;
		stamp.neighbors [__mod__ (index + 3, 6)] = self;
	});},
	get offset_point () {return __get__ (this, function (self, offset_u, offset_v) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'offset_u': var offset_u = __allkwargs0__ [__attrib0__]; break;
						case 'offset_v': var offset_v = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var uv = [self.reference_point [0] + offset_u, self.reference_point [1] + offset_v];
		return self.tile.f (...self.tile.blend (...uv));
	});},
	get offset_vert () {return __get__ (this, function (self, offset_u, offset_v) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'offset_u': var offset_u = __allkwargs0__ [__attrib0__]; break;
						case 'offset_v': var offset_v = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var point = self.offset_point (offset_u, offset_v);
		return self.tile.mesh_adaptor.create_vert (point);
	});},
	get add_offset_vert () {return __get__ (this, function (self, i, offset_u, offset_v) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'i': var i = __allkwargs0__ [__attrib0__]; break;
						case 'offset_u': var offset_u = __allkwargs0__ [__attrib0__]; break;
						case 'offset_v': var offset_v = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (self.verts [i]) {
			return null;
		}
		var __left0__ = self.offset_vert (offset_u, offset_v);
		var vert = __left0__;
		self.verts [i] = __left0__;
		return vert;
	});},
	get color_stamp () {return __get__ (this, function (self, color) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'color': var color = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		for (var face of self.faces) {
			self.tile.mesh_adaptor.color_face (face, color);
		}
	});}
});
export var Stamp14Tile =  __class__ ('Stamp14Tile', [Tile], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, tessagon, stamp_class) {
		var kwargs = dict ();
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'tessagon': var tessagon = __allkwargs0__ [__attrib0__]; break;
						case 'stamp_class': var stamp_class = __allkwargs0__ [__attrib0__]; break;
						default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
					}
				}
				delete kwargs.__kwargtrans__;
			}
		}
		else {
		}
		__super__ (Stamp14Tile, '__init__') (self, tessagon, __kwargtrans__ (kwargs));
		self.stamp_class = stamp_class;
		self.stamps = (function () {
			var __accu0__ = [];
			for (var i = 0; i < 14; i++) {
				__accu0__.append (null);
			}
			return __accu0__;
		}) ();
	});},
	get initialize_stamps () {return __get__ (this, function (self) {
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
		for (var i = 0; i < 14; i++) {
			self.initialize_stamp (i);
		}
	});},
	get initialize_stamp () {return __get__ (this, function (self, i) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'i': var i = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (self.stamps [i]) {
			return ;
		}
		if (__in__ (i, [0, 1, 2])) {
			if (!(self.get_neighbor_tile (['bottom']))) {
				return ;
			}
			if (i == 0) {
				if (!(self.get_neighbor_tile (['left']))) {
					return ;
				}
				if (!(self.get_neighbor_tile (['bottom', 'left']))) {
					return ;
				}
			}
		}
		if (i == 5) {
			if (!(self.get_neighbor_tile (['left']))) {
				return ;
			}
		}
		if (i == 9) {
			if (!(self.get_neighbor_tile (['right']))) {
				return ;
			}
		}
		if (__in__ (i, [12, 13])) {
			if (!(self.get_neighbor_tile (['top']))) {
				return ;
			}
		}
		var u = i * (3.0 / 14.0);
		var v = u / 3.0;
		while (u > 1) {
			u--;
		}
		self.stamps [i] = self.stamp_class (self, i, [u, v]);
	});},
	get initialize_stamps_neighbors () {return __get__ (this, function (self) {
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
		for (var i = 0; i < 14; i++) {
			self.initialize_stamp_neighbors (i);
		}
	});},
	get initialize_stamp_neighbors () {return __get__ (this, function (self, i) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'i': var i = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (!(self.stamps [i])) {
			return ;
		}
		var stamp = self.stamps [i];
		var row = Math.floor (i / 5);
		var column = __mod__ (i, 5);
		if (column < 4 && i < 13) {
			stamp.set_neighbor (0, self.stamps [i + 1]);
		}
		else if (i == 13) {
			stamp.set_neighbor (0, self.get_neighbor_stamp (['right', 'top'], 0));
		}
		else {
			stamp.set_neighbor (0, self.get_neighbor_stamp (['right'], i + 1));
		}
		if (row < 2 && i < 9) {
			stamp.set_neighbor (1, self.stamps [i + 5]);
		}
		else if (i == 9) {
			stamp.set_neighbor (1, self.get_neighbor_stamp (['right', 'top'], 0));
		}
		else {
			stamp.set_neighbor (1, self.get_neighbor_stamp (['top'], i - 9));
		}
		if (row < 2 && column > 0) {
			stamp.set_neighbor (2, self.stamps [i + 4]);
		}
		else if (column == 0 && i != 10) {
			stamp.set_neighbor (2, self.get_neighbor_stamp (['left'], i + 4));
		}
		else {
			stamp.set_neighbor (2, self.get_neighbor_stamp (['top'], i - 10));
		}
		if (column > 1) {
			stamp.set_neighbor (3, self.stamps [i - 1]);
		}
		else if (i == 0) {
			stamp.set_neighbor (3, self.get_neighbor_stamp (['left', 'bottom'], 13));
		}
		else {
			stamp.set_neighbor (3, self.get_neighbor_stamp (['left'], i - 1));
		}
		if (row > 0) {
			stamp.set_neighbor (4, self.stamps [i - 5]);
		}
		else if (i == 0) {
			stamp.set_neighbor (4, self.get_neighbor_stamp (['left', 'bottom'], 9));
		}
		else {
			stamp.set_neighbor (4, self.get_neighbor_stamp (['bottom'], i + 9));
		}
		if (row > 0 && column < 4) {
			stamp.set_neighbor (5, self.stamps [i - 4]);
		}
		else if (column == 4) {
			stamp.set_neighbor (5, self.get_neighbor_stamp (['right'], i - 4));
		}
		else {
			stamp.set_neighbor (5, self.get_neighbor_stamp (['bottom'], i + 10));
		}
	});},
	get get_neighbor_stamp () {return __get__ (this, function (self, neighbor_keys, index) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'neighbor_keys': var neighbor_keys = __allkwargs0__ [__attrib0__]; break;
						case 'index': var index = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var tile = self.get_neighbor_tile (neighbor_keys);
		if (!(tile)) {
			return null;
		}
		return tile.stamps [index];
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
		return null;
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
		for (var stamp of self.stamps) {
			if (stamp) {
				stamp.calculate_verts ();
			}
		}
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
		return null;
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
		for (var stamp of self.stamps) {
			if (stamp) {
				stamp.calculate_faces ();
			}
		}
	});}
});
export var Stamp14Tessagon =  __class__ ('Stamp14Tessagon', [Tessagon], {
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
		__super__ (Stamp14Tessagon, '__init__') (self, __kwargtrans__ (kwargs));
		self.stamps = [];
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
		__super__ (Stamp14Tessagon, '_initialize_tiles') (self);
		self._initialize_stamps ();
		self._initialize_stamp_neighbors ();
	});},
	get _initialize_stamps () {return __get__ (this, function (self) {
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
			tile.initialize_stamps ();
		}
	});},
	get _initialize_stamp_neighbors () {return __get__ (this, function (self) {
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
			tile.initialize_stamps_neighbors ();
		}
	});}
});

//# sourceMappingURL=tessagon.core.stamp14_tessagon.map