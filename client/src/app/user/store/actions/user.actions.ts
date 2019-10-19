import { Action } from '@ngrx/store';
import { User } from '../../interfaces/user.interface';

export enum UserActionTypes {
  SetUser = '[User] Set user',
}

export class SetUser implements Action {
  readonly type = UserActionTypes.SetUser;

  constructor(public payload: User) {
  }
}

export type UserActions = SetUser;
