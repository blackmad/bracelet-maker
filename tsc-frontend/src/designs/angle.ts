export class Angle {
    public degrees: number;
    constructor(public radians: number) {
        this.degrees = radians * 180/Math.PI;
    }

    static fromAngle(angle: number) {
        return new Angle(angle * Math.PI/180)
    }

    static fromRadians(rads: number) {
        return new Angle(rads)
    }
}

export default Angle;