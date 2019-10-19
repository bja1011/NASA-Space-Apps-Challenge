import { GameState } from '../reducers/game.reducer';
import { State } from '../../../store/root/reducers';
import { Planet } from '../interfaces/game.interfaces';
import { createSelector } from '@ngrx/store';

export const selectGame = (state: State) => (state as any).gameState;

const getPlanets = (state: GameState): Planet[] => state.planets;
export const selectPlanets = createSelector<State, object, Planet[]>(
  selectGame,
  getPlanets
);
