export class Angle {
    constructor(radians) {
        this.radians = radians;
        this.degrees = radians * 180 / Math.PI;
    }
    static fromDegrees(angle) {
        return new Angle(angle * Math.PI / 180);
    }
    static fromRadians(rads) {
        return new Angle(rads);
    }
}
export default Angle;
//# sourceMappingURL=angle.js.map