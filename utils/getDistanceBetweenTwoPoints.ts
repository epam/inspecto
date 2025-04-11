type GetDistanceBetweenTwoPoints = (point1: Coordinates, point2: Coordinates) => number;

export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export const getDistanceBetweenTwoPoints: GetDistanceBetweenTwoPoints = (point1: Coordinates, point2: Coordinates) => {
  const deltaX = point1.x - point2.x;
  const deltaY = point1.y - point2.y;
  const deltaZ = point1.z - point2.z;

  return Math.sqrt(deltaX ** 2 + deltaY ** 2 + deltaZ ** 2);
};
