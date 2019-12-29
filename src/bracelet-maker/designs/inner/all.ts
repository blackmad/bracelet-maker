import { InnerDesignCirclePacking } from "./circle-packing";
import { InnerDesignVera } from "./vera";
import { InnerDesignHashmarks } from "./hashmarks";
import { InnerDesignCirclesXVera } from "./circles-x-vera";
import { InnerDesignVoronoi } from "./voronoi";
import { InnerDesignLattice } from "./lattice";
import { InnerDesignHexes } from "./hexes";
import { InnerDesignLines } from "./lines";
import { InnerDesignMondrian } from "./mondrian";
import { InnerDesignExplode } from "./explode";
import { InnerDesignEmpty } from "./empty";
import { InnerDesignSunflower } from "./sunflower";
import { InnerDesignTessagon } from "./tessagon";
import { InnerDesignTactile } from "./tactile";

import { InnerDesignPerlinDots } from "./perlin-dots";
import { InnerDesignPerlinBlobs } from "./perlin-blobs";
import { InnerDesignGrid } from "./grid";
import { InnerDesignSnowflake } from "./snowflake";
import { InnerDesignMap } from "./map";

export const AllInnerDesigns = [
  InnerDesignPerlinBlobs,
  InnerDesignVoronoi,
  InnerDesignTessagon,
  InnerDesignHashmarks,
  InnerDesignVera,
  InnerDesignHexes,
  InnerDesignSnowflake,
  InnerDesignMap,
  InnerDesignSunflower,
  InnerDesignGrid,
  InnerDesignLattice,
  InnerDesignCirclesXVera,
  InnerDesignCirclePacking,
  InnerDesignLines, // - KINDA BROKEN
  InnerDesignMondrian,
  InnerDesignPerlinDots,
  // InnerDesignTactile, - UNFINISHED
  // InnerDesignExplode, - BROKEN
  InnerDesignEmpty,
];
