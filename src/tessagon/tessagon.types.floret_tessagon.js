// Transcrypt'ed from Python, 2019-10-10 23:37:04
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {TessagonMetadata} from './tessagon.core.tessagon_metadata.js';
import {Stamp14, Stamp14Tessagon, Stamp14Tile} from './tessagon.core.stamp14_tessagon.js';
var __name__ = 'tessagon.types.floret_tessagon';
export var metadata = TessagonMetadata (__kwargtrans__ ({py_name: 'Florets', num_color_patterns: 3, classification: 'laves', shapes: ['pentagons'], sides: [5]}));
export var Floret =  __class__ ('Floret', [Stamp14], {
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
		return (function () {
			var __accu0__ = [];
			for (var i = 0; i < 19; i++) {
				__accu0__.append (null);
			}
			return __accu0__;
		}) ();
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
		return (function () {
			var __accu0__ = [];
			for (var i = 0; i < 6; i++) {
				__accu0__.append (null);
			}
			return __accu0__;
		}) ();
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
		var vert = __super__ (Floret, 'add_offset_vert') (self, i, offset_u, offset_v);
		if (vert) {
			if (i == 18) {
				self.tile.tessagon.vert_types ['center'].append (vert);
			}
			else if (__mod__ (i, 3) == 2) {
				self.tile.tessagon.vert_types ['other'].append (vert);
			}
			else {
				self.tile.tessagon.vert_types ['edge_to_center'].append (vert);
			}
		}
		return true;
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
		self.add_offset_vert (18, 0, 0);
		var unit_u = 2.0 / 42.0;
		var unit_v = 1.0 / 14.0;
		var d_u = 2.0 * unit_u;
		var d_v = 2.0 * unit_v;
		self.add_offset_vert (0, d_u, 0);
		self.add_offset_vert (9, -(d_u), 0);
		self.add_offset_vert (2, d_u, d_v);
		self.add_offset_vert (16, d_u, -(d_v));
		self.add_offset_vert (7, -(d_u), d_v);
		self.add_offset_vert (11, -(d_u), -(d_v));
		var d_u = unit_u;
		self.add_offset_vert (3, d_u, d_v);
		self.add_offset_vert (15, d_u, -(d_v));
		self.add_offset_vert (6, -(d_u), d_v);
		self.add_offset_vert (12, -(d_u), -(d_v));
		var d_u = 0.5 * unit_u;
		var d_v = 3 * unit_v;
		self.add_offset_vert (4, d_u, d_v);
		self.add_offset_vert (14, d_u, -(d_v));
		self.add_offset_vert (5, -(d_u), d_v);
		self.add_offset_vert (13, -(d_u), -(d_v));
		var d_u = 2.5 * unit_u;
		var d_v = unit_v;
		self.add_offset_vert (1, d_u, d_v);
		self.add_offset_vert (17, d_u, -(d_v));
		self.add_offset_vert (8, -(d_u), d_v);
		self.add_offset_vert (10, -(d_u), -(d_v));
		for (var neighbor = 0; neighbor < 6; neighbor++) {
			var other_floret = self.neighbors [neighbor];
			if (!(other_floret)) {
				continue;
			}
			for (var i = 0; i < 4; i++) {
				var src = __mod__ ((3 * neighbor + i) - 1, 18);
				var dest = __mod__ ((3 * neighbor - i) + 11, 18);
				if (self.verts [src]) {
					other_floret.verts [dest] = self.verts [src];
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
		for (var i = 0; i < 6; i++) {
			var last = __mod__ (3 * i + 3, 18);
			var verts = [self.verts [3 * i], self.verts [3 * i + 1], self.verts [3 * i + 2], self.verts [last], self.verts [18]];
			self.faces [i] = self.tile.mesh_adaptor.create_face (verts);
		}
	});}
});
export var FloretTile =  __class__ ('FloretTile', [Stamp14Tile], {
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
		__super__ (FloretTile, '__init__') (self, tessagon, Floret, __kwargtrans__ (kwargs));
	});},
	get color_pattern1 () {return __get__ (this, function (self) {
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
			if (!(self.stamps [i])) {
				continue;
			}
			if (__mod__ (i - self.fingerprint [1], 3) == 0) {
				self.stamps [i].color_stamp (1);
			}
			else {
				self.stamps [i].color_stamp (0);
			}
		}
	});},
	get color_pattern2 () {return __get__ (this, function (self) {
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
			if (!(self.stamps [i])) {
				continue;
			}
			var color = __mod__ (i - self.fingerprint [1], 3);
			self.stamps [i].color_stamp (color);
		}
	});},
	get set_default_color () {return __get__ (this, function (self, color) {
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
		for (var i = 0; i < 14; i++) {
			if (!(self.stamps [i])) {
				continue;
			}
			self.stamps [i].color_stamp (color);
		}
	});},
	get color_pattern3 () {return __get__ (this, function (self) {
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
			if (__mod__ ((Math.floor (i / 5) + self.fingerprint [0]) + self.fingerprint [1], 2) > 0) {
				continue;
			}
			if (__mod__ (i + 2 * self.fingerprint [1], 6) > 0) {
				continue;
			}
			self.stamps [i].color_stamp (1);
			for (var stamp of self.stamps [i].neighbors) {
				stamp.color_stamp (2);
			}
		}
	});}
});
export var FloretTessagon =  __class__ ('FloretTessagon', [Stamp14Tessagon], {
	__module__: __name__,
	tile_class: FloretTile,
	metadata: metadata,
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
		__super__ (FloretTessagon, '__init__') (self, __kwargtrans__ (kwargs));
		self.vert_types = dict ({'center': [], 'edge_to_center': [], 'other': []});
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
		if (self.color_pattern == 3) {
			for (var tile of self.tiles) {
				tile.set_default_color (0);
			}
		}
		for (var tile of self.tiles) {
			tile.calculate_colors ();
		}
	});}
});

//# sourceMappingURL=tessagon.types.floret_tessagon.map