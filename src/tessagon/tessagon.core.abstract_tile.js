// Transcrypt'ed from Python, 2019-10-10 22:21:02
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {ValueBlend} from './tessagon.core.value_blend.js';
var __name__ = 'tessagon.core.abstract_tile';
export var AbstractTile =  __class__ ('AbstractTile', [ValueBlend], {
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
		self.tessagon = tessagon;
		self.f = tessagon.f;
		self.u_symmetric = false;
		self.v_symmetric = false;
		if (__in__ ('u_symmetric', kwargs)) {
			self.u_symmetric = kwargs ['u_symmetric'];
		}
		if (__in__ ('v_symmetric', kwargs)) {
			self.v_symmetric = kwargs ['v_symmetric'];
		}
		self.id = null;
		if (__in__ ('id', kwargs)) {
			self.id = kwargs ['id'];
		}
		self.fingerprint = kwargs.py_get ('fingerprint') || null;
		self.corners = null;
		self._init_corners (__kwargtrans__ (kwargs));
		self.neighbors = dict ({'top': null, 'bottom': null, 'left': null, 'right': null});
		self.twist = dict ({'top': false, 'bottom': false, 'left': false, 'right': false});
	});},
	get set_neighbors () {return __get__ (this, function (self) {
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
		if (__in__ ('top', kwargs)) {
			self.neighbors ['top'] = kwargs ['top'];
		}
		if (__in__ ('bottom', kwargs)) {
			self.neighbors ['bottom'] = kwargs ['bottom'];
		}
		if (__in__ ('left', kwargs)) {
			self.neighbors ['left'] = kwargs ['left'];
		}
		if (__in__ ('right', kwargs)) {
			self.neighbors ['right'] = kwargs ['right'];
		}
	});},
	get get_neighbor_tile () {return __get__ (this, function (self, neighbor_keys) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'neighbor_keys': var neighbor_keys = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var tile = self;
		for (var key of self._neighbor_path (neighbor_keys)) {
			if (!(tile.neighbors [key])) {
				return null;
			}
			var tile = tile.neighbors [key];
		}
		return tile;
	});},
	get inspect () {return __get__ (this, function (self) {
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
		if (!(self.id)) {
			return ;
		}
		var prefix = 'Tile';
		if (__in__ ('tile_number', kwargs)) {
			prefix += __mod__ (' #%s', kwargs ['tile_number']);
		}
		print (__mod__ ('%s (%s):', tuple ([prefix, self.__class__.__name__])));
		print (__mod__ ('  - self:      %s', self.id));
		print ('  - neighbors:');
		for (var key of ['top', 'left', 'right', 'bottom']) {
			if (self.neighbors [key]) {
				var tile = self.neighbors [key];
				if (tile.id) {
					print (__mod__ ('    - %s', self._neighbor_str (key)));
				}
			}
		}
		print (__mod__ ('  - corners: (%2.4f, %2.4f)  (%2.4f, %2.4f)', tuple (self.corners [2] + self.corners [3])));
		print (__mod__ ('             (%2.4f, %2.4f)  (%2.4f, %2.4f)', tuple (self.corners [0] + self.corners [1])));
		print ('  - twist:', self.twist);
		if (self.fingerprint) {
			print ('  - fingerprint:', self.fingerprint);
		}
		print ('');
	});},
	get _get_nested_list_value () {return __get__ (this, function (self, nested_list, index_keys) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'nested_list': var nested_list = __allkwargs0__ [__attrib0__]; break;
						case 'index_keys': var index_keys = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (!(isinstance (index_keys, list))) {
			return nested_list [index_keys];
		}
		var value = nested_list;
		for (var index of index_keys) {
			var value = value [index];
		}
		return value;
	});},
	get _set_nested_list_value () {return __get__ (this, function (self, nested_list, index_keys, value) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'nested_list': var nested_list = __allkwargs0__ [__attrib0__]; break;
						case 'index_keys': var index_keys = __allkwargs0__ [__attrib0__]; break;
						case 'value': var value = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (!(isinstance (index_keys, list))) {
			nested_list [index_keys] = value;
			return ;
		}
		var reference = nested_list;
		for (var index of index_keys.__getslice__ (0, -(1), 1)) {
			var reference = reference [index];
		}
		var key = index_keys [len (index_keys) - 1];
		reference [key] = value;
	});},
	get _neighbor_path () {return __get__ (this, function (self, neighbor_keys) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'neighbor_keys': var neighbor_keys = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (len (neighbor_keys) < 2) {
			return neighbor_keys;
		}
		if (self._should_twist_u (neighbor_keys)) {
			if (__in__ (neighbor_keys [0], ['top', 'bottom'])) {
				return [neighbor_keys [1], neighbor_keys [0]];
			}
		}
		else if (self._should_twist_v (neighbor_keys)) {
			if (__in__ (neighbor_keys [0], ['left', 'right'])) {
				return [neighbor_keys [1], neighbor_keys [0]];
			}
		}
		return neighbor_keys;
	});},
	get _index_path () {return __get__ (this, function (self, index_keys, neighbor_keys) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'index_keys': var index_keys = __allkwargs0__ [__attrib0__]; break;
						case 'neighbor_keys': var neighbor_keys = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var path = index_keys;
		if (self._should_twist_u (neighbor_keys)) {
			var path = self._u_flip (path);
		}
		if (self._should_twist_v (neighbor_keys)) {
			var path = self._v_flip (path);
		}
		return path;
	});},
	get _swap_value () {return __get__ (this, function (self, index_keys, val1, val2) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'index_keys': var index_keys = __allkwargs0__ [__attrib0__]; break;
						case 'val1': var val1 = __allkwargs0__ [__attrib0__]; break;
						case 'val2': var val2 = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (isinstance (index_keys, list)) {
			return (function () {
				var __accu0__ = [];
				for (var u of index_keys) {
					__accu0__.append (self._swap_value (u, val1, val2));
				}
				return __accu0__;
			}) ();
		}
		if (index_keys == val1) {
			return val2;
		}
		if (index_keys == val2) {
			return val1;
		}
		return index_keys;
	});},
	get _u_flip () {return __get__ (this, function (self, index_keys) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'index_keys': var index_keys = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (!(self.u_symmetric)) {
			return index_keys;
		}
		return self._swap_value (index_keys, 'left', 'right');
	});},
	get _v_flip () {return __get__ (this, function (self, index_keys) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'index_keys': var index_keys = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (!(self.v_symmetric)) {
			return index_keys;
		}
		return self._swap_value (index_keys, 'bottom', 'top');
	});},
	get _v_index () {return __get__ (this, function (self, index_keys) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'index_keys': var index_keys = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (__in__ ('bottom', index_keys)) {
			return 'bottom';
		}
		if (__in__ ('top', index_keys)) {
			return 'top';
		}
		var __except0__ = ValueError (__mod__ ('no v_index found in %s', index_keys));
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get _u_index () {return __get__ (this, function (self, index_keys) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'index_keys': var index_keys = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		if (__in__ ('left', index_keys)) {
			return 'left';
		}
		if (__in__ ('right', index_keys)) {
			return 'right';
		}
		var __except0__ = ValueError (__mod__ ('no u_index found in %s', index_keys));
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get _should_twist_u () {return __get__ (this, function (self, neighbor_keys) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'neighbor_keys': var neighbor_keys = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		for (var twist of ['top', 'bottom']) {
			if (self.twist [twist] && __in__ (twist, neighbor_keys)) {
				return true;
			}
		}
		return false;
	});},
	get _should_twist_v () {return __get__ (this, function (self, neighbor_keys) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'neighbor_keys': var neighbor_keys = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		for (var twist of ['left', 'right']) {
			if (self.twist [twist] && __in__ (twist, neighbor_keys)) {
				return true;
			}
		}
		return false;
	});},
	get _neighbor_str () {return __get__ (this, function (self, key) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'key': var key = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		else {
		}
		var tile = self.neighbors [key];
		if (tile) {
			return __mod__ ('%-9s%s', tuple ([__mod__ ('%s:', key), tile.id]));
		}
		return __mod__ ('%s: None', key);
	});}
});

//# sourceMappingURL=tessagon.core.abstract_tile.map