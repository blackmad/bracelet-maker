// Transcrypt'ed from Python, 2019-10-15 14:58:56
import { ValueError, __class__, __get__, __in__, dict, object } from './org.transcrypt.__runtime__.js';
var __name__ = 'tessagon.core.tessagon_metadata';
export var TessagonMetadata = __class__('TessagonMetadata', [object], {
    __module__: __name__,
    CLASSIFICATION_MAP: dict({ 'regular': 'Regular tiling', 'archimedean': 'Archimedean tiling', 'laves': 'Laves tiling', 'non_edge': 'Non-edge-to-edge tiling' }),
    get __init__() {
        return __get__(this, function (self) {
            var kwargs = dict();
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            self._name = kwargs.py_get('name');
            if (!(self._name)) {
                var __except0__ = ValueError('No name set');
                __except0__.__cause__ = null;
                throw __except0__;
            }
            self._num_color_patterns = kwargs.py_get('num_color_patterns', 0);
            self._classification = kwargs.py_get('classification', 'misc');
            self._shapes = kwargs.py_get('shapes', []);
            self._sides = kwargs.py_get('sides', []);
        });
    },
    get py_name() {
        return __get__(this, function (self) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            return self._name;
        });
    },
    get num_color_patterns() {
        return __get__(this, function (self) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            return self._num_color_patterns;
        });
    },
    get has_color_patterns() {
        return __get__(this, function (self) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            return self._num_color_patterns > 0;
        });
    },
    get has_shape() {
        return __get__(this, function (self, shape) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'shape':
                                var shape = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            if (__in__(shape, self._shapes)) {
                return true;
            }
            return false;
        });
    },
    get classification() {
        return __get__(this, function (self) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            return self._classification;
        });
    },
    get has_classification() {
        return __get__(this, function (self, classification) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                            case 'classification':
                                var classification = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            return self._classification == classification;
        });
    },
    get human_readable_classification() {
        return __get__(this, function (self) {
            if (arguments.length) {
                var __ilastarg0__ = arguments.length - 1;
                if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
                    var __allkwargs0__ = arguments[__ilastarg0__--];
                    for (var __attrib0__ in __allkwargs0__) {
                        switch (__attrib0__) {
                            case 'self':
                                var self = __allkwargs0__[__attrib0__];
                                break;
                        }
                    }
                }
            }
            else {
            }
            return self.__class__.CLASSIFICATION_MAP[self._classification];
        });
    }
});
//# sourceMappingURL=tessagon.core.tessagon_metadata.map
//# sourceMappingURL=tessagon.core.tessagon_metadata.js.map