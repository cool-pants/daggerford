export type AtlasMapId = "delimbiyr" | "daggerford";
export type MapTagFilter = AtlasMapId | "all";

export type AtlasMap = {
  id: AtlasMapId;
  label: string;
  tag: `#${AtlasMapId}`;
  url: string;
  width: number;
  height: number;
  bounds: [[number, number], [number, number]];
};

export const ATLAS_MAPS: AtlasMap[] = [
  {
    id: "daggerford",
    label: "Daggerford",
    tag: "#daggerford",
    url: "/maps/Daggerford-Map-Forgotten-Realms.webp",
    width: 1384,
    height: 1780,
    bounds: [
      [0, 0],
      [1780, 1384]
    ]
  },
  {
    id: "delimbiyr",
    label: "Delimbiyr",
    tag: "#delimbiyr",
    url: "/maps/Delimbiyr-FULL.webp",
    width: 2349,
    height: 3144,
    bounds: [
      [0, 0],
      [3144, 2349]
    ]
  }
];

export const DEFAULT_MAP_ID: AtlasMapId = "delimbiyr";

export function getAtlasMap(id: AtlasMapId) {
  return ATLAS_MAPS.find((map) => map.id === id) ?? ATLAS_MAPS[0];
}

export function getMapTag(id: AtlasMapId) {
  return getAtlasMap(id).tag;
}

export function latLngToImagePoint(lat: number, lng: number) {
  return {
    x: Math.round(lng),
    y: Math.round(lat)
  };
}

export type MapPoint = {
  x: number;
  y: number;
};

const DELIMBIYR_REFERENCE = {
  from: { x: 928, y: 1342 },
  to: { x: 1017, y: 1453 },
  kilometers: 23,
  miles: 15
};

export const DELIMBIYR_TRAVEL_BASE_HOURS = [
  { label: "On foot (normal)", hours: 10 },
  { label: "On foot (fast)", hours: 8 },
  { label: "On foot (slow)", hours: 13 },
  { label: "Rowboat", hours: 28 },
  { label: "Keelboat", hours: 15 },
  { label: "Sailing ship", hours: 8 },
  { label: "Warship", hours: 6 },
  { label: "Longship", hours: 5 },
  { label: "Galley", hours: 4 },
  { label: "Dragon/griffon", hours: 3 },
  { label: "Construct", hours: 2 }
];

function getPointDistance(a: MapPoint, b: MapPoint) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

const delimbiyrReferencePixels = getPointDistance(DELIMBIYR_REFERENCE.from, DELIMBIYR_REFERENCE.to);
const delimbiyrKmPerPixel = DELIMBIYR_REFERENCE.kilometers / delimbiyrReferencePixels;
const delimbiyrMilesPerPixel = DELIMBIYR_REFERENCE.miles / delimbiyrReferencePixels;

export function getPathPixelDistance(points: MapPoint[]) {
  return points.reduce((total, point, index) => {
    if (index === 0) {
      return 0;
    }
    return total + getPointDistance(points[index - 1], point);
  }, 0);
}

export function getDelimbiyrPathDistance(points: MapPoint[]) {
  const pixels = getPathPixelDistance(points);
  return {
    pixels,
    kilometers: pixels * delimbiyrKmPerPixel,
    miles: pixels * delimbiyrMilesPerPixel
  };
}

export function formatDistance(value: number) {
  if (value >= 10) {
    return Math.round(value).toString();
  }
  return value.toFixed(1);
}

export function formatTravelTime(hours: number) {
  const roundedHours = Math.max(0, Math.round(hours));
  const days = Math.floor(roundedHours / 24);
  const remainder = roundedHours % 24;
  return `${days} day${days === 1 ? "" : "s"} and ${remainder} hour${remainder === 1 ? "" : "s"}`;
}
