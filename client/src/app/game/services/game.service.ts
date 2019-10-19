import { EventEmitter, Injectable } from '@angular/core';
import { AngularGame, GameEvent } from '../game-engine/interfaces/game.interfaces';
import { MyGame } from '../game-engine/game-babylon/classes/MyGame.class';
import { GameState } from '../store/reducers/game.reducer';
import { Store } from '@ngrx/store';
import * as GUI from 'dat.gui';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  gui: any;

  gameEmitter: EventEmitter<GameEvent> = new EventEmitter();
  game: MyGame;

  constructor(
    public store: Store<GameState>
  ) {
    this.gui = new GUI.GUI({width: 300});
  }

  emitGameEvent(name: string, value: any) {
    this.gameEmitter.emit({name, value});
  }
}
