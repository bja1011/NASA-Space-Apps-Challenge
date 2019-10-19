import { EventEmitter, Injectable } from '@angular/core';
import { AngularGame, GameEvent } from '../game-engine/interfaces/game.interfaces';
import { MyGame } from '../game-engine/game-babylon/classes/MyGame.class';
import { GameState } from '../store/reducers/game.reducer';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  gameEmitter: EventEmitter<GameEvent> = new EventEmitter();
  game: MyGame;

  constructor(
    public store: Store<GameState>
  ) {
  }

  emitGameEvent(name: string, value: any) {
    this.gameEmitter.emit({name, value});
  }
}
