function Cuff(
    height,
    wristWidthRaw,
    forearm_circumference,
    buffer_width, 
    hash_width,
    seed
) {
    //var height = 2;
    var wristWidth = wristWidthRaw - 0.2;
    var sideBufferBottom = 1.0;
    var totalWidthBottom = wristWidth + sideBufferBottom*2;
    var sideBufferTop = 0.7;
    var sideBufferGap = sideBufferBottom - sideBufferTop;

    var FilletRadius = 0.2;

    var YPadding = 0.3;

    var DesignBuffer = sideBufferBottom - sideBufferTop;

    var points = [
        [0, 0], 
        [sideBufferGap, height], 
        [totalWidthBottom - sideBufferGap, height],
        [totalWidthBottom, 0]
    ];

    var leftBolts = makeTwoEvenlySpacedBolts([sideBufferTop*1/2 + RivetRadius, 0], [sideBufferTop*1/2 + DesignBuffer + RivetRadius, height]);
    var rightBolts = makeTwoEvenlySpacedBolts([totalWidthBottom - (sideBufferTop*1/2), 0], [totalWidthBottom - DesignBuffer - (sideBufferTop*1/2), height]);
    
    this.models = {
        leftBolts: leftBolts,
        rightBolts: rightBolts,
        cuff: new makerjs.models.ConnectTheDots(true, points),
        design: makerjs.model.move(
            makerjs.model.combineIntersection(
                new InnerDesign(height, wristWidth, seed, buffer_width, hash_width),
                new makerjs.models.Rectangle(wristWidth, height - YPadding*2)
            ),
            [sideBufferBottom, YPadding]
        )
    };

    var chain = makerjs.model.findSingleChain(this.models.cuff);
    var filletsModel = makerjs.chain.fillet(chain, FilletRadius);
    this.models.fillets = filletsModel;

    this.units = makerjs.unitType.Inch;

    //this.layer = "red";
}