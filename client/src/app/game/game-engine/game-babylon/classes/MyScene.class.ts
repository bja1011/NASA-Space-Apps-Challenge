import * as B from 'babylonjs';
import { GameService } from '../../../services/game.service';

export class MyScene extends B.Scene {

  gameService: GameService;

  constructor(engine: B.Engine, gameService: GameService) {
    super(engine);
    this.gameService = gameService;
  }
}
