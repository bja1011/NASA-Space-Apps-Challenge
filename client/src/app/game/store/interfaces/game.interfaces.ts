export interface SpaceObject {
  name: string;
  location: Location;
  mass: number;
  radius: number;
}

export interface Star extends SpaceObject {
  uvRadiation: number;
}

export interface Planet extends SpaceObject {
  speed: number;
  id: number;
}

export interface Location {
  x: number;
  y: number;
  z: number;
}
