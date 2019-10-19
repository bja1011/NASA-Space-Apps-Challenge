import { Component, OnInit } from '@angular/core';
import { Engines, GameEvent } from '../interfaces/game.interfaces';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss']
})
export class EngineComponent implements OnInit {

  engines = Engines;
  selectedEngine: Engines = 1;

  constructor(private gameService: GameService,
  ) {
    this.gameService.gameEmitter
      .subscribe((event: GameEvent) => {
        switch (event.name) {
          case 'setEngine':
            this.selectedEngine = event.value;
            break;
        }
      });
  }

  ngOnInit() {
  }
}
