import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { GAME_EVENTS } from '../../../constants/game.constants';
import * as GameActions from '../../../store/actions/game.actions';
import { Planet } from '../../../store/interfaces/game.interfaces';
import { select } from '@ngrx/store';
import { selectPickedPlanet, selectPlanetById } from '../../../store/selectors/game.selectors';
import { Observable } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-ui',
  templateUrl: './main-ui.component.html',
  styleUrls: ['./main-ui.component.scss']
})
export class MainUiComponent implements OnInit {

  gui: any;
  selectedPlanet: Planet;
  panelHidden: boolean;

  temperatureMock: string;

  constructor(private authService: AuthService,
              private router: Router,
              private gameService: GameService,
  ) {
  }

  ngOnInit() {
    this.gameService.store
      .pipe(
        select(selectPickedPlanet),
        filter(state => !!state)
      )
      .subscribe((planetState => {
        this.selectedPlanet = planetState;
        this.calculateTemperatureStatus();
      }));

    this.createEmptyPlanet();
    this.createEmptyPlanet();
    this.createEmptyPlanet();
  }

  createPlanet() {
    this.createEmptyPlanet();
  }

  createEmptyPlanet() {
    this.gameService.store.dispatch({
      type: GameActions.GameActionTypes.CREATE_PLANET
    });
  }

  updateRadius($event: MatSliderChange) {
    this.selectedPlanet.radius = $event.value;
    this.gameService.store.dispatch(new GameActions.UpdatePlanet(this.selectedPlanet));
  }

  updateDistance($event: MatSliderChange) {
    this.selectedPlanet.position.x = $event.value;
    this.gameService.store.dispatch(new GameActions.UpdatePlanet(this.selectedPlanet));
  }

  calculateTemperatureStatus() {
    let tempIndicator = 0;
    if (this.selectedPlanet.position.x < 700) {
      tempIndicator = 0.3;
    } else if (this.selectedPlanet.position.x >= 700 && this.selectedPlanet.position.x < 4000) {
      tempIndicator = 0.5;
    } else {
      tempIndicator = 0.7;
    }

    const radiusFac = this.selectedPlanet.radius / 100;
    this.temperatureMock += tempIndicator * radiusFac;

    if (tempIndicator <= 0.3) {
      this.temperatureMock = 'Too hot!';
    } else if (tempIndicator > 0.3 && tempIndicator < 0.7) {
      this.temperatureMock = 'Good!';
    } else {
      this.temperatureMock = 'Too cold!';
    }

  }

  updateMass($event: MatSliderChange) {
    this.selectedPlanet.mass = $event.value;
    this.gameService.store.dispatch(new GameActions.UpdatePlanet(this.selectedPlanet));
  }

  switchPanel() {
    this.panelHidden = !this.panelHidden;
  }
}
