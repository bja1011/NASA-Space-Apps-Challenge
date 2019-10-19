import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { GAME_EVENTS } from '../../../constants/game.constants';
import { GameActionTypes } from '../../../store/actions/game.actions';
import * as GUI from 'dat.gui';
import { Planet } from '../../../store/interfaces/game.interfaces';
import { select } from '@ngrx/store';
import { selectPickedPlanet, selectPlanetById } from '../../../store/selectors/game.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-ui',
  templateUrl: './main-ui.component.html',
  styleUrls: ['./main-ui.component.scss']
})
export class MainUiComponent implements OnInit {

  gui: any;
  selectedPlanet$: Observable<Planet>;

  constructor(private authService: AuthService,
              private router: Router,
              private gameService: GameService,
  ) {
  }

  ngOnInit() {
    this.gui = new GUI.GUI({width: 300});

    this.selectedPlanet$ = this.gameService.store
      .pipe(
        select(selectPickedPlanet)
      );
  }

  createPlanet() {
    this.createEmptyPlanet();
  }

  createEmptyPlanet() {
    this.gameService.store.dispatch({
      type: GameActionTypes.CREATE_PLANET
    });
  }

  createStar() {
    this.gameService.emitGameEvent(GAME_EVENTS.CREATE_EMPTY_STAR, Math.random());
  }
}
