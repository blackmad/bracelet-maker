import * as _ from 'lodash';
import { Delaunay, Voronoi } from 'd3-delaunay';

import { RangeMetaParameter, MetaParameter, OnOffMetaParameter, SelectMetaParameter } from '../../meta-parameter';
import { FastAbstractInnerDesign } from './fast-abstract-inner-design';
import { randomPointInPolygon, bufferShape } from '../../utils/paperjs-utils';
import ExtendPaperJs from 'paperjs-offset';
import { start } from 'repl';
import { point } from '@/bracelet-maker/types/makerjs';
import { runInNewContext } from 'vm';

export class InnerDesignDelaunayShapes extends FastAbstractInnerDesign {
  needSubtraction = false;
  allowOutline = true;

  makeDesign(paper: paper.PaperScope, params) {
    ExtendPaperJs(paper);

    Math.random = this.rng;

    const seedPoints = [];
    const { 
      numPoints = 100,
    } = params;
    const boundaryModel: paper.PathItem = params.boundaryModel;
    for (let i = 0; i < numPoints; i++) {
      const testPoint = randomPointInPolygon(paper, boundaryModel, this.rng);
      seedPoints.push([testPoint.x, testPoint.y]);
    }

    var delaunay = Delaunay.from(seedPoints);

    const edgeToTriangleLookup = new Map()
    const triangleToEdgeLookup = new Map()

    const addEdge = (triangleIndex, pointIndex1, pointIndex2) => {
      const points = [pointIndex1, pointIndex2];
      points.sort();
      const edgeKey = points[0] + '_' + points[1];
      if (!edgeToTriangleLookup[edgeKey]) {
        edgeToTriangleLookup[edgeKey] = [];
      }
      edgeToTriangleLookup[edgeKey].push(triangleIndex)

      if (!triangleToEdgeLookup[triangleIndex]) {
        triangleToEdgeLookup[triangleIndex] = [];
      }
      triangleToEdgeLookup[triangleIndex].push(edgeKey);
    }

    const triangleMap = {};
    for (let i = 0; i*3 < delaunay.triangles.length; i++) {
      const pIndex1 = delaunay.triangles[i];
      const pIndex2 = delaunay.triangles[i+1];
      const pIndex3 = delaunay.triangles[i+2];

      const candidateTriangle = new paper.Path([
        new paper.Point(delaunay.points[pIndex1*2], delaunay.points[pIndex1*2+1]),
        new paper.Point(delaunay.points[pIndex2*2], delaunay.points[pIndex2*2+1]),
        new paper.Point(delaunay.points[pIndex3*2], delaunay.points[pIndex3*2+1])
      ])
      candidateTriangle.closePath();

      addEdge(i, pIndex1, pIndex2);
      addEdge(i, pIndex2, pIndex3);
      addEdge(i, pIndex3, pIndex1);

      triangleMap[i] = candidateTriangle;
    }

    const maxNumJoins = 20;
    const minNumJoins = 5;
    const maxRandJoinTries = 10;
    const newPolys = [];

    const tryMakeShape = (startTriangleIndex) => {
      if (!triangleMap[startTriangleIndex]) {
        return;
      }
      console.log(`trying triangle ${startTriangleIndex}`)
      console.log(`trying triangle ${triangleMap[startTriangleIndex]}`)
      let currentStartTriangleIndex = startTriangleIndex;
      let numJoinedTriangles = 1;
      while (numJoinedTriangles < maxNumJoins) {
        // pick a random triangle to start
        // pick a random edge in that triangle
        // look at other triangles that edge is it -> randomly pick one, if it's used, randomly pick another until you find one or maxRandJoinTries is reached
        console.log(`edge indexes in triangle ${currentStartTriangleIndex} are ${triangleToEdgeLookup[currentStartTriangleIndex]}`)
        // TODO: deterministic shuffle
        // const shuffledPoints = _.shuffle(triangleToEdgeLookup[currentStartTriangleIndex]);
        const shuffledPoints = triangleToEdgeLookup[currentStartTriangleIndex];
        console.log(`edge indexes in triangle ${currentStartTriangleIndex} are ${triangleToEdgeLookup[currentStartTriangleIndex]}`)

        const tryFindAdjoiningTriangle = (edgeIndex) => {
          console.log(`looking at edgeIndex ${edgeIndex}`)
          console.log(`it is in triangles: ${edgeToTriangleLookup[edgeIndex]}`)

          let nextTriangleIndexCandidate = null;

          const maxTries = 20;
          let numTriangleSearchTries = 0;
          const possibleTriangleIndexes = edgeToTriangleLookup[edgeIndex].filter((triangleIndex) => triangleIndex != currentStartTriangleIndex);
          while (numTriangleSearchTries < maxTries) {
            numTriangleSearchTries++;

            nextTriangleIndexCandidate = possibleTriangleIndexes[Math.ceil(this.rng()*possibleTriangleIndexes.length)];

            const candidateTriangle = triangleMap[nextTriangleIndexCandidate];
            
            if (!candidateTriangle) {
              continue;
            }
            // if (candidateTriangle.intersects(triangleMap[startTriangleIndex])) {
            //   continue;
            // }
            return nextTriangleIndexCandidate;
          }     
          return null;
        }

        let nextTriangleIndex = null;
        for (let i = 0; i < shuffledPoints.length; i++) {
          nextTriangleIndex = tryFindAdjoiningTriangle(shuffledPoints[i]);
          if (nextTriangleIndex != null) {
            break;
          }
        }

        if (nextTriangleIndex == null) {
          break;
        }

        // join the triangles to current working set
        console.log(triangleMap)
        console.log(startTriangleIndex);
        console.log(triangleMap[startTriangleIndex]);

        console.log(nextTriangleIndex);
        console.log(triangleMap[nextTriangleIndex]);
        // triangleMap[nextTriangleIndex].fillColor = 'blue';

        triangleMap[startTriangleIndex] = triangleMap[startTriangleIndex].unite(
          triangleMap[nextTriangleIndex]);

        // mark joined triangle as used
        triangleMap[nextTriangleIndex] = null;

        currentStartTriangleIndex = nextTriangleIndex;
        numJoinedTriangles += 1;
      }
      triangleMap[startTriangleIndex].closePath();
      newPolys.push(triangleMap[startTriangleIndex]);
    }

    for (let i = 0; i < 5; i++) {
      tryMakeShape(Math.ceil(this.rng() * _.keys(triangleMap).length))
    }
    
    // debugger;
    // newPolys.push(bufferShape(paper, 0, triangleMap[startTriangleIndex].points));
   
    return newPolys;

    // return _.values(triangleMap).filter((p) => p);
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: 'Num Points',
        min: 100,
        max: 1000,
        value: 100,
        step: 1,
        name: 'numPoints'
      }),
    ];
  }
}
