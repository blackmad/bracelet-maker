const uuidv1 = require('uuid/v1');
import RBush from "rbush";
import * as _ from 'lodash';

function uniteTouchingPathsOnePass(paths: paper.PathItem[]) {
  const toTreeEntry = (path: paper.PathItem): any => {
    return {
      minX: path.bounds.topLeft.x - 0.01,
      minY: path.bounds.topLeft.y - 0.01,
      maxX: path.bounds.bottomRight.x + 0.01,
      maxY: path.bounds.bottomRight.y + 0.01
    };
  };

  const tree = new RBush();
  const pathDict = {};
  paths.forEach(path => {
    const id = uuidv1();
    pathDict[id] = path;
    tree.insert({
      id,
      ...toTreeEntry(path)
    });
  });

  const joinedPaths = [];
  const deleted = {};
  let didJoin = false;
  _.forEach(pathDict, (path: paper.Path, id) => {
    // console.log(`looking at ${id}`);
    if (deleted[id]) {
      return;
    }
    let currentPath: paper.PathItem = path;
    const maybeIntersects = tree.search(toTreeEntry(path));
    maybeIntersects.forEach((maybeIntersectTreeEntry: any) => {
      const otherId = maybeIntersectTreeEntry.id;
      // console.log(`maybe intersects ${otherId}`)
      if (deleted[otherId] || otherId == id) {
        // console.log('otherId was deleted or is identity, skipping')
        return;
      }
      const otherPath: paper.Path = pathDict[otherId];
      if (currentPath.intersects(otherPath)) {
        // console.log(`${otherId} does intersect ${id}`)
        currentPath = currentPath.unite(otherPath);
        // console.log('intersected and deleted otherId')
        deleted[otherId] = true;
        didJoin = true;
      }
    });

    joinedPaths.push(currentPath);
  });
  return { didJoin, joinedPaths };
}

export function cascadedUnion(_paths: paper.PathItem[]): paper.PathItem[] {
  let shouldStop = false;
  let paths = _paths;
  while (!shouldStop) {
    console.log("trying to join paths pass");
    const { didJoin, joinedPaths } = uniteTouchingPathsOnePass(paths);
    shouldStop = !didJoin;
    paths = joinedPaths;
  }
  return paths;
}