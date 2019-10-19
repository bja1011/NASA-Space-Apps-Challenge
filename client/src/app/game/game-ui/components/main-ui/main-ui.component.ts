import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { GAME_EVENTS } from '../../../constants/game.constants';
import * as GameActions from '../../../store/actions/game.actions';
import * as GUI from 'dat.gui';
import { Planet } from '../../../store/interfaces/game.interfaces';
import { select } from '@ngrx/store';
import { selectPickedPlanet, selectPlanetById } from '../../../store/selectors/game.selectors';
import { Observable } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-main-ui',
  templateUrl: './main-ui.component.html',
  styleUrls: ['./main-ui.component.scss']
})
export class MainUiComponent implements OnInit {

  gui: any;
  selectedPlanet: Planet;

  constructor(private authService: AuthService,
              private router: Router,
              private gameService: GameService,
  ) {
  }

  ngOnInit() {
    this.gui = new GUI.GUI({width: 300});

    this.gameService.store
      .pipe(
        select(selectPickedPlanet)
      )
      .subscribe((planetState => this.selectedPlanet = planetState));

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
}
