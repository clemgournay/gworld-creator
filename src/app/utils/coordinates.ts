import { Coordinate } from '@models/coordinate';

export const ParseCoordinates = (coor: string): Coordinate => {
  const parts = coor.split('-');
  return {i: parseInt(parts[0]), j: parseInt(parts[1])};
}
