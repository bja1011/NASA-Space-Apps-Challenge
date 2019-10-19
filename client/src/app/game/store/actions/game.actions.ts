import { Action } from '@ngrx/store';
import { Planet } from '../interfaces/game.interfaces';

export enum GameActionTypes {
  CREATE_PLANET = '[Game] Create planet',
  CREATE_STAR = '[Game] Create star',
  PICK_PLANET = '[Game] Pick planet',
  UPDATE_PLANET = '[Game] Update planet',
}

export class CreatePlanet implements Action {
  readonly type = GameActionTypes.CREATE_PLANET;
}

export class PickPlanet implements Action {
  readonly type = GameActionTypes.PICK_PLANET;

  constructor(public payload: Planet) {

  }
}

export class UpdatePlanet implements Action {
  readonly type = GameActionTypes.UPDATE_PLANET;

  constructor(public payload: Planet) {

  }
}

export class CreateStar implements Action {
  readonly type = GameActionTypes.CREATE_STAR;
}

export type GameActions =
  CreatePlanet |
  CreateStar |
  PickPlanet |
  UpdatePlanet
  ;
