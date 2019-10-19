import { GameActions, GameActionTypes } from '../actions/game.actions';
import { Planet, SpaceObject, Star } from '../interfaces/game.interfaces';
import * as R from 'ramda';

export interface GameState {
  stars: Star[];
  planets: Planet[];
}

export const initialState: GameState = {
  planets: [],
  stars: []
};

export function reducer(state = initialState, action: GameActions): GameState {
  switch (action.type) {

    case GameActionTypes.CREATE_STAR:
      return state;

    case GameActionTypes.CREATE_PLANET:
      const planets = R.clone(state.planets);
      planets.push(createEmptyPlanet(planets));
      return {
        ...state,
        planets
      };

    default:
      return state;
  }
}

function createSpaceObject(params: SpaceObject) {
  const star: Star = {
    ...params,
    uvRadiation: 0
  };
}

function createStar(star: Star) {
  createSpaceObject(star);
}

function createPlanet(params: Planet) {
  const planet: Planet = {
    ...params
  };
  return planet;
}

function createEmptyPlanet(existingPlanets: Planet[]): Planet {
  let x = 30;
  if (existingPlanets.length > 0) {
    const farPlanet = existingPlanets[existingPlanets.length - 1];
    x = farPlanet.location.x + 30;
  }

  return createPlanet({
    location: {
      x, y: 0, z: 0,
    },
    mass: 1,
    name: null,
    radius: 1,
    speed: 1
  });
}
