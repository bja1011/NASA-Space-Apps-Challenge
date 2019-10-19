import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game/game.component';
import { GameEngineModule } from './game-engine/game-engine.module';
import { GameUiModule } from './game-ui/game-ui.module';
import { GameService } from './services/game.service';
import { GameStoreModule } from './store/game-store.module';

@NgModule({
  declarations: [GameComponent],
  imports: [
    CommonModule,
    GameEngineModule,
    GameUiModule,
    GameStoreModule,
  ],
  exports: [GameComponent],
  providers: [GameService],
})
export class GameModule {
}
