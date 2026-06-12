export const MAP_IMAGE_URL = "/maps/sword-coast.jpg";

export const MAP_SIZE = {
  width: 1525,
  height: 1050
};

export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [0, 0],
  [MAP_SIZE.height, MAP_SIZE.width]
];

export function latLngToImagePoint(lat: number, lng: number) {
  return {
    x: Math.round(lng),
    y: Math.round(lat)
  };
}
