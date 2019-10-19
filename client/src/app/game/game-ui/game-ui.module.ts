import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainUiComponent } from './components/main-ui/main-ui.component';
import { MatButtonModule } from '@angular/material';
import { BottomButtonsComponent } from './components/bottom-buttons/bottom-buttons.component';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [MainUiComponent, BottomButtonsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSliderModule,
  ],
  exports: [
    MainUiComponent,
  ]
})
export class GameUiModule {
}
