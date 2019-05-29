export class Angle {
    constructor({rads}) {
        this.radians = rads;
        this.degrees = rads * 180/Math.PI;
    }

    static fromAngle(angle) {
        return new Angle({rads: angle * Math.PI/180})
    }

    static fromRadians(rads) {
        return new Angle({rads: rads})
    }
}

export default Angle;