import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { GAME_EVENTS } from '../../../constants/game.constants';
import { GameActionTypes } from '../../../store/actions/game.actions';

@Component({
  selector: 'app-main-ui',
  templateUrl: './main-ui.component.html',
  styleUrls: ['./main-ui.component.scss']
})
export class MainUiComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private gameService: GameService,
  ) {
  }

  ngOnInit() {
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
