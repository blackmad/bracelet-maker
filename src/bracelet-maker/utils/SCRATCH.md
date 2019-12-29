// generate random shapes in boundary
    // _.times(1, () => {
    //   const circleCenter = new paper.Point(
    //     this.rng() * boundaryModel.bounds.width,
    //     this.rng() * boundaryModel.bounds.height
    //   ).add(boundaryModel.bounds.topLeft);

    //   const shape = new Triangle().makeShape(paper, 0.5, 0.5);
    //   shape.translate(circleCenter);
    //   paths.push(shape);

    //   // const circle = new paper.Path.Circle(circleCenter, 0.25);
    //   // paths.push(circle);
    // });


    // extend a line a wee bit
            // extend a weeee bit
      
        const lenAB = Math.sqrt(Math.pow(A.x - B.x, 2.0) + Math.pow(A.y - B.y, 2.0));
        const length = 0.001;
        // just in case you are wondering where this comes from, (B.x - A.x) / lenAB * length is the same as cos(slope_alpha) * length...helped for me – fersarr Sep 4 '13 at 9:41
        const newEndpoint = new paper.Point(
          B.x + (B.x - A.x) / lenAB * length,
          B.y + (B.y - A.y) / lenAB * length
        );
        const newStartpoint = new paper.Point(
          A.x - (B.x - A.x) / lenAB * length,
          A.y - (B.y - A.y) / lenAB * length
        );