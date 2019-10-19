import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainUiComponent } from './components/main-ui/main-ui.component';
import { MatButtonModule } from '@angular/material';
import { BottomButtonsComponent } from './components/bottom-buttons/bottom-buttons.component';

@NgModule({
  declarations: [MainUiComponent, BottomButtonsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  exports: [
    MainUiComponent,
  ]
})
export class GameUiModule {
}
