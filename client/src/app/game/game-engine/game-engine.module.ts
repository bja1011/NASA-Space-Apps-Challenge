import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBabylonModule } from './game-babylon/game-babylon.module';
import { EngineComponent } from './engine/engine.component';

@NgModule({
  declarations: [EngineComponent],
  imports: [
    CommonModule,
    GameBabylonModule,
  ],
  exports: [
    EngineComponent,
  ],
})
export class GameEngineModule {
}
