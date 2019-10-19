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

const getPlanetById = (state: GameState, props: { planetId: number }): Planet => state.planets
  .find(planet => planet.id === props.planetId);
export const selectPlanetById = createSelector(
  selectGame,
  getPlanetById
);

const getPickedPlanet = (state: GameState): Planet => state.pickedPlanet;
export const selectPickedPlanet = createSelector(
  selectGame,
  getPickedPlanet
);
