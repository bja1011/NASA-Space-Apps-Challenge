export interface SpaceObject {
  name: string;
  position: Location;
  mass: number;
  radius: number;
}

export interface Star extends SpaceObject {
  uvRadiation: number;
}

export interface Planet extends SpaceObject {
  speed: number;
  id: number;
  parameters?: PlanetParameters;
}

export interface Location {
  x: number;
  y: number;
  z: number;
}

export interface PlanetParameters {
  temperature: number;
  type: PlanetType;
  startVelocity: {
    x: number;
    y: number;
    z: number;
  };
}

export enum PlanetType {
  Rocks
}
