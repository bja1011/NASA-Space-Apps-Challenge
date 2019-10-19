import { Action } from '@ngrx/store';

export enum GameActionTypes {
  CREATE_PLANET = '[Game] Create planet',
  CREATE_STAR = '[Game] Create star',
}

export class CreatePlanet implements Action {
  readonly type = GameActionTypes.CREATE_PLANET;
}

export class CreateStar implements Action {
  readonly type = GameActionTypes.CREATE_STAR;
}

export type GameActions =
  CreatePlanet |
  CreateStar
  ;
