// Transcrypt'ed from Python, 2019-10-15 14:58:57
import { __class__, __get__, __kwargtrans__, dict } from './org.transcrypt.__runtime__.js';
import { TessagonMetadata } from './tessagon.core.tessagon_metadata.js';
import { Tessagon } from './tessagon.core.tessagon.js';
import { DissectedHexQuadTile } from './tessagon.types.dissected_hex_quad_tessagon.js';
var __name__ = 'tessagon.types.dissected_hex_tri_tessagon';
export var metadata = TessagonMetadata(__kwargtrans__({ py_name: 'Hexagons Dissected with Triangles', classification: 'laves', shapes: ['triangles'], sides: [3] }));
export var DissectedHexTriTile = __class__('DissectedHexTriTile', [DissectedHexQuadTile], {
    __module__: __name__,
    get init_faces() {
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
            return dict({ 'left': dict({ 'top': dict({ 'v_boundary': null, 'u_boundary': null, 'middle': null, 'center': null, 'interior1': null, 'interior2': null }), 'bottom': dict({ 'v_boundary': null, 'u_boundary': null, 'middle': null, 'center': null, 'interior1': null, 'interior2': null }) }), 'right': dict({ 'top': dict({ 'v_boundary': null, 'u_boundary': null, 'middle': null, 'center': null, 'interior1': null, 'interior2': null }), 'bottom': dict({ 'v_boundary': null, 'u_boundary': null, 'middle': null, 'center': null, 'interior1': null, 'interior2': null }) }) });
        });
    },
    get calculate_faces() {
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
            self.add_face(['left', 'top', 'v_boundary'], [['left', 'top', 'corner'], ['center', 'top', 'v_boundary'], ['center', 'top', 'interior']]);
            self.add_face(['left', 'top', 'interior1'], [['left', 'top', 'corner'], ['center', 'top', 'interior'], ['left', 'top', 'interior']]);
            self.add_face(['left', 'top', 'u_boundary'], [['left', 'top', 'corner'], ['left', 'top', 'interior'], ['left', 'top', 'u_boundary']]);
            self.add_face(['left', 'top', 'middle'], [['center', 'middle'], ['left', 'middle'], ['left', 'top', 'u_boundary']]);
            self.add_face(['left', 'top', 'interior2'], [['left', 'top', 'interior'], ['center', 'middle'], ['left', 'top', 'u_boundary']]);
            self.add_face(['left', 'top', 'center'], [['center', 'middle'], ['left', 'top', 'interior'], ['center', 'top', 'interior']]);
        });
    }
});
export var DissectedHexTriTessagon = __class__('DissectedHexTriTessagon', [Tessagon], {
    __module__: __name__,
    tile_class: DissectedHexTriTile,
    metadata: metadata
});
//# sourceMappingURL=tessagon.types.dissected_hex_tri_tessagon.map
//# sourceMappingURL=tessagon.types.dissected_hex_tri_tessagon.js.map