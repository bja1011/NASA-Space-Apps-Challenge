import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BabylonComponent } from './babylon/babylon.component';

@NgModule({
  declarations: [BabylonComponent],
  imports: [
    CommonModule
  ],
  exports: [
    BabylonComponent,
  ]
})
export class GameBabylonModule {
}
