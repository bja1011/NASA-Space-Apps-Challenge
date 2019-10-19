export interface AngularGame {
  gameEngine: Engines;
}

export enum Engines {
  babylon = 1,
}

export interface GameEvent {
  name: string;
  value: any;
}
