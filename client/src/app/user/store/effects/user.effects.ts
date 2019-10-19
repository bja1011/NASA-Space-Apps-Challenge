import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { concatMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { UserActionTypes, UserActions } from '../actions/user.actions';



@Injectable()
export class UserEffects {


  // @Effect()
  // loadUsers$ = this.actions$.pipe(
  //   ofType(UserActionTypes.LoadUsers),
  //   /** An EMPTY observable only emits completion. Replace with your own observable API request */
  //   concatMap(() => EMPTY)
  // );


  constructor(private actions$: Actions<UserActions>) {}

}
