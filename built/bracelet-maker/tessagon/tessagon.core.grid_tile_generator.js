// Transcrypt'ed from Python, 2019-10-15 14:58:57
import { __class__, __get__, __kwargtrans__, __super__, dict } from './org.transcrypt.__runtime__.js';
import { TileGenerator } from './tessagon.core.tile_generator.js';
var __name__ = 'tessagon.core.grid_tile_generator';
export var GridTileGenerator = __class__('GridTileGenerator', [TileGenerator], {
    __module__: __name__,
    get __init__() {
        return __get__(this, function (self, tessagon) {
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
                            case 'tessagon':
                                var tessagon = __allkwargs0__[__attrib0__];
                                break;
                            default: kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
                        }
                    }
                    delete kwargs.__kwargtrans__;
                }
            }
            else {
            }
            __super__(GridTileGenerator, '__init__')(self, tessagon, __kwargtrans__(kwargs));
            self.tiles = null;
        });
    },
    get create_tiles() {
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
            self.tiles = self.initialize_tiles(self.tessagon.__class__.tile_class);
            self.initialize_neighbors(self.tiles);
            return (function () {
                var __accu0__ = [];
                for (var i of self.tiles) {
                    for (var j of i) {
                        __accu0__.append(j);
                    }
                }
                return __accu0__;
            })();
        });
    }
});
//# sourceMappingURL=tessagon.core.grid_tile_generator.map
//# sourceMappingURL=tessagon.core.grid_tile_generator.js.map