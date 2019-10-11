// Transcrypt'ed from Python, 2019-10-10 23:37:02
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {AbstractTile} from './tessagon.core.abstract_tile.js';
import {TileGenerator} from './tessagon.core.tile_generator.js';
var __name__ = 'tessagon.core.rotate_tile_generator';
export var RotateTileGenerator =  __class__ ('RotateTileGenerator', [TileGenerator], {
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
		__super__ (RotateTileGenerator, '__init__') (self, tessagon, __kwargtrans__ (kwargs));
		self.rot_factor = kwargs ['rot_factor'];
		self.color_pattern = kwargs.py_get ('color_pattern') || null;
		self.rot_tiles = null;
		self.id_prefix = 'rot_tiles';
	});},
	get create_tiles () {return __get__ (this, function (self) {
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
		self.rot_tiles = self.initialize_tiles (RotTile, __kwargtrans__ ({rot_factor: self.rot_factor, color_pattern: self.color_pattern}));
		self.initialize_neighbors (self.rot_tiles);
		self.initialize_interiors ();
		self.initialize_boundaries ();
		self.calculate_boundary_neighbors ();
		return self.calculate_rot_tiles ();
	});},
	get initialize_interiors () {return __get__ (this, function (self) {
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
		for (var rot_tile of (function () {
			var __accu0__ = [];
			for (var i of self.rot_tiles) {
				for (var j of i) {
					__accu0__.append (j);
				}
			}
			return __accu0__;
		}) ()) {
			rot_tile.initialize_interior ();
		}
	});},
	get initialize_boundaries () {return __get__ (this, function (self) {
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
		for (var rot_tile of (function () {
			var __accu0__ = [];
			for (var i of self.rot_tiles) {
				for (var j of i) {
					__accu0__.append (j);
				}
			}
			return __accu0__;
		}) ()) {
			rot_tile.initialize_boundary ();
		}
	});},
	get calculate_boundary_neighbors () {return __get__ (this, function (self) {
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
		for (var rot_tile of (function () {
			var __accu0__ = [];
			for (var i of self.rot_tiles) {
				for (var j of i) {
					__accu0__.append (j);
				}
			}
			return __accu0__;
		}) ()) {
			rot_tile.calculate_boundary_neighbors ();
		}
	});},
	get calculate_rot_tiles () {return __get__ (this, function (self) {
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
		var tiles = [];
		for (var rot_tile of (function () {
			var __accu0__ = [];
			for (var i of self.rot_tiles) {
				for (var j of i) {
					__accu0__.append (j);
				}
			}
			return __accu0__;
		}) ()) {
			var tiles = tiles.__add__ (rot_tile.create_tiles ());
		}
		return tiles;
	});}
});
export var RotTile =  __class__ ('RotTile', [AbstractTile], {
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
		__super__ (RotTile, '__init__') (self, tessagon, __kwargtrans__ (kwargs));
		self.n = kwargs ['rot_factor'];
		self.interior = null;
		self.boundary = dict ({'left': null, 'right': null, 'top': null, 'bottom': null});
		self.interior_corners = null;
		self.color_pattern = kwargs.py_get ('color_pattern') || null;
		self.u_num = self.tessagon.tile_generator.u_num;
		var n2_p1 = Math.pow (self.n, 2) + 1.0;
		self.c1 = 1.0 / n2_p1;
		self.c2 = self.n / n2_p1;
		self.c3 = 1.0 - self.c2;
		self.c4 = 1.0 - self.c1;
		self.tiles = [];
	});},
	get initialize_interior () {return __get__ (this, function (self) {
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
		self.interior_corners = [self.blend (self.c2, self.c1), self.blend (self.c4, self.c2), self.blend (self.c1, self.c3), self.blend (self.c3, self.c4)];
		if (self.n < 2) {
			return ;
		}
		var offset = self.basic_offset (self.fingerprint);
		var generator = TileGenerator (self.tessagon, __kwargtrans__ ({corners: self.interior_corners, u_num: self.n - 1, v_num: self.n - 1, u_cyclic: false, v_cyclic: false, id_prefix: self.id + '.interior', color_pattern: self.color_pattern, fingerprint_offset: offset}));
		self.interior = generator.initialize_tiles (self.tessagon.__class__.tile_class);
		generator.initialize_neighbors (self.interior);
		self.tiles = self.tiles.__add__ (self._flatten_list (self.interior));
	});},
	get basic_offset () {return __get__ (this, function (self, fingerprint) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'fingerprint': var fingerprint = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		return [(fingerprint [0] * self.n + fingerprint [1]) + 1, (self.u_num - fingerprint [0]) + fingerprint [1] * self.n];
	});},
	get create_tiles () {return __get__ (this, function (self) {
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
		return self.tiles;
	});},
	get initialize_boundary () {return __get__ (this, function (self) {
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
		self.initialize_left_boundary (self.id + ".boundary['left']");
		self.initialize_right_boundary (self.id + ".boundary['right']");
		self.initialize_top_boundary (self.id + ".boundary['top']");
		self.initialize_bottom_boundary (self.id + ".boundary['bottom']");
	});},
	get initialize_left_boundary () {return __get__ (this, function (self, id_prefix) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'id_prefix': var id_prefix = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (!(self.boundary ['left'])) {
			var tile = self.get_neighbor_tile (['left']);
			if (tile) {
				var corners = [self.blend (0, 0), self.blend (self.c2, self.c1), self.blend (self.c3 - 1.0, self.c4), self.blend (0, 1)];
				var offset = self.basic_offset (self.fingerprint);
				offset [0]--;
				var generator = TileGenerator (self.tessagon, __kwargtrans__ ({corners: corners, u_num: 1, v_num: self.n, u_cyclic: false, v_cyclic: false, id_prefix: id_prefix, color_pattern: self.color_pattern, fingerprint_offset: offset}));
				var tiles = generator.initialize_tiles (self.tessagon.tile_class);
				generator.initialize_neighbors (tiles);
				self.boundary ['left'] = tiles;
				tile.boundary ['right'] = tiles;
				self.tiles = self.tiles.__add__ (self._flatten_list (tiles));
			}
		}
	});},
	get initialize_bottom_boundary () {return __get__ (this, function (self, id_prefix) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'id_prefix': var id_prefix = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (!(self.boundary ['bottom'])) {
			var tile = self.get_neighbor_tile (['bottom']);
			if (tile) {
				var corners = [self.blend (self.c1, self.c3 - 1.0), self.blend (1, 0), self.blend (0, 0), self.blend (self.c4, self.c2)];
				var offset = self.basic_offset (self.fingerprint);
				offset [0]--;
				offset [1]--;
				var generator = TileGenerator (self.tessagon, __kwargtrans__ ({corners: corners, u_num: self.n, v_num: 1, u_cyclic: false, v_cyclic: false, id_prefix: id_prefix, color_pattern: self.color_pattern, fingerprint_offset: offset}));
				var tiles = generator.initialize_tiles (self.tessagon.tile_class);
				generator.initialize_neighbors (tiles);
				self.boundary ['bottom'] = tiles;
				tile.boundary ['top'] = tiles;
				self.tiles = self.tiles.__add__ (self._flatten_list (tiles));
			}
		}
	});},
	get initialize_right_boundary () {return __get__ (this, function (self, id_prefix) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'id_prefix': var id_prefix = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (!(self.boundary ['right'])) {
			var tile = self.get_neighbor_tile (['right']);
			if (tile) {
				tile.initialize_left_boundary (id_prefix);
			}
		}
	});},
	get initialize_top_boundary () {return __get__ (this, function (self, id_prefix) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'id_prefix': var id_prefix = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (!(self.boundary ['top'])) {
			var tile = self.get_neighbor_tile (['top']);
			if (tile) {
				tile.initialize_bottom_boundary (id_prefix);
			}
		}
	});},
	get calculate_boundary_neighbors () {return __get__ (this, function (self) {
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
		self.calculate_left_boundary_neighbors ();
		self.calculate_right_boundary_neighbors ();
		self.calculate_top_boundary_neighbors ();
		self.calculate_bottom_boundary_neighbors ();
	});},
	get calculate_left_boundary_neighbors () {return __get__ (this, function (self) {
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
		if (self.boundary ['left']) {
			for (var i = 0; i < self.n - 1; i++) {
				var boundary_tile = self.boundary ['left'] [0] [i];
				var other_tile = null;
				if (self.n > 1) {
					var other_tile = self.interior [0] [i];
				}
				if (other_tile) {
					boundary_tile.neighbors ['right'] = other_tile;
					other_tile.neighbors ['left'] = boundary_tile;
				}
			}
			if (self.boundary ['top']) {
				var boundary_tile = self.boundary ['left'] [0] [self.n - 1];
				var other_tile = self.boundary ['top'] [0] [0];
				boundary_tile.neighbors ['right'] = other_tile;
				other_tile.neighbors ['left'] = boundary_tile;
			}
		}
	});},
	get calculate_bottom_boundary_neighbors () {return __get__ (this, function (self) {
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
		if (self.boundary ['bottom']) {
			for (var i = 0; i < self.n - 1; i++) {
				var boundary_tile = self.boundary ['bottom'] [i + 1] [0];
				var other_tile = null;
				if (self.n > 1) {
					var other_tile = self.interior [i] [0];
				}
				if (other_tile) {
					boundary_tile.neighbors ['top'] = other_tile;
					other_tile.neighbors ['bottom'] = boundary_tile;
				}
			}
			if (self.boundary ['left']) {
				var boundary_tile = self.boundary ['bottom'] [0] [0];
				var other_tile = self.boundary ['left'] [0] [0];
				boundary_tile.neighbors ['top'] = other_tile;
				other_tile.neighbors ['bottom'] = boundary_tile;
			}
		}
	});},
	get calculate_right_boundary_neighbors () {return __get__ (this, function (self) {
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
		if (self.boundary ['right']) {
			for (var i = 0; i < self.n - 1; i++) {
				var boundary_tile = self.boundary ['right'] [0] [i + 1];
				var other_tile = null;
				if (self.n > 1) {
					var other_tile = self.interior [self.n - 2] [i];
				}
				if (other_tile) {
					boundary_tile.neighbors ['left'] = other_tile;
					other_tile.neighbors ['right'] = boundary_tile;
				}
			}
			if (self.boundary ['bottom']) {
				var boundary_tile = self.boundary ['right'] [0] [0];
				var other_tile = self.boundary ['bottom'] [self.n - 1] [0];
				boundary_tile.neighbors ['left'] = other_tile;
				other_tile.neighbors ['right'] = boundary_tile;
			}
		}
	});},
	get calculate_top_boundary_neighbors () {return __get__ (this, function (self) {
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
		if (self.boundary ['top']) {
			for (var i = 0; i < self.n - 1; i++) {
				var boundary_tile = self.boundary ['top'] [i] [0];
				var other_tile = null;
				if (self.n > 1) {
					var other_tile = self.interior [i] [self.n - 2];
				}
				if (other_tile) {
					boundary_tile.neighbors ['bottom'] = other_tile;
					other_tile.neighbors ['top'] = boundary_tile;
				}
			}
			if (self.boundary ['right']) {
				var boundary_tile = self.boundary ['top'] [self.n - 1] [0];
				var other_tile = self.boundary ['right'] [0] [self.n - 1];
				boundary_tile.neighbors ['bottom'] = other_tile;
				other_tile.neighbors ['top'] = boundary_tile;
			}
		}
	});},
	get _flatten_list () {return __get__ (this, function (self, l) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'l': var l = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		return (function () {
			var __accu0__ = [];
			for (var sublist of l) {
				for (var item of sublist) {
					__accu0__.append (item);
				}
			}
			return __accu0__;
		}) ();
	});}
});

//# sourceMappingURL=tessagon.core.rotate_tile_generator.map