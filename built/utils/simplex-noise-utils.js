export class SimplexNoiseUtils {
    static positiveNoise2D(simplexGenerator, xin, yin) {
        return (simplexGenerator.noise2D(xin, yin) + 1.0) / 2.0;
    }
    static noise2DInRange(simplexGenerator, xin, yin, min, max) {
        return SimplexNoiseUtils.positiveNoise2D(simplexGenerator, xin, yin) * (max - min) + min;
    }
}
//# sourceMappingURL=simplex-noise-utils.js.map