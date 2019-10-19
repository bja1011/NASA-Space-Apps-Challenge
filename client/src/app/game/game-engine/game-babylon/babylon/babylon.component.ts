import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyGame } from '../classes/MyGame.class';
import { GameService } from '../../../services/game.service';
import { PlanetsGame } from '../planets-game/planets.game';

@Component({
  selector: 'app-babylon',
  templateUrl: './babylon.component.html',
  styleUrls: ['./babylon.component.scss']
})
export class BabylonComponent implements OnInit, OnDestroy {

  game: MyGame;

  constructor(private gameService: GameService,
  ) {
  }

  ngOnInit() {
    this.game = new PlanetsGame(this.gameService);
    this.game.doRender();
  }

  ngOnDestroy(): void {
    this.game.destroy();
  }
}
