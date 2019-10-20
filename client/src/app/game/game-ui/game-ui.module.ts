import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainUiComponent } from './components/main-ui/main-ui.component';
import { MatButtonModule } from '@angular/material';
import { BottomButtonsComponent } from './components/bottom-buttons/bottom-buttons.component';
import { MatSliderModule } from '@angular/material/slider';
import { GuToAuPipe } from './pipes/gu-to-au.pipe';

@NgModule({
  declarations: [MainUiComponent, BottomButtonsComponent, GuToAuPipe],
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
