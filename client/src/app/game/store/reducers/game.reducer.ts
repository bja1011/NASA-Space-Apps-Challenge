import { GameActions, GameActionTypes } from '../actions/game.actions';
import { Planet, SpaceObject, Star } from '../interfaces/game.interfaces';
import * as R from 'ramda';

export interface GameState {
  stars: Star[];
  planets: Planet[];
  pickedPlanet: Planet;
}

export const initialState: GameState = {
  planets: [],
  pickedPlanet: null,
  stars: []
};

export function reducer(state = initialState, action: GameActions): GameState {
  switch (action.type) {

    case GameActionTypes.PICK_PLANET:
      return {
        ...state,
        pickedPlanet: action.payload
      };

    case GameActionTypes.CREATE_STAR:
      return state;

    case GameActionTypes.UPDATE_PLANET:
      const planetsUpdated = R.clone(state.planets).filter(planet => planet.id !== action.payload.id);
      planetsUpdated.push(R.clone(action.payload));
      return {
        ...state,
        pickedPlanet: R.clone(action.payload),
        planets: planetsUpdated
      };

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

function createEmptyPlanet(existingPlanets?: Planet[]): Planet {
  let x = 300;
  let id = 0;
  if (existingPlanets && existingPlanets.length > 0) {
    const highestId = existingPlanets.map(planet => planet.id).sort().pop();
    const farPosition = existingPlanets.map(planet => planet.position.x).sort().pop();
    const farPlanet = existingPlanets.find(planet => planet.position.x === farPosition);

    x = farPlanet.position.x + farPlanet.radius + 40;
    id = highestId + 1;
  }

  return createPlanet({
    position: {
      x, y: 0, z: 0,
    },
    mass: 1,
    id,
    name: `planet-${id}`,
    radius: Math.floor(10 + 30 * Math.random()),
    speed: 1
  });
}
