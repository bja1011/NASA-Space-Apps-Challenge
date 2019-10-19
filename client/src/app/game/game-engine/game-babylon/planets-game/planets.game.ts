import { MyGame } from '../classes/MyGame.class';
import { GameService } from '../../../services/game.service';

export class PlanetsGame extends MyGame {
  constructor(gameService: GameService) {
    const canvas = 'planet-game';
    super(gameService, canvas);
    this.gameService = gameService;
  }
}
