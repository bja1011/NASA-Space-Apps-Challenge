import { UserActions, UserActionTypes } from '../actions/user.actions';
import { User } from '../../interfaces/user.interface';

export interface State {
  user?: User;
  isAuthenticated: boolean;
}

export const initialState: State = {
  isAuthenticated: false
};

export function reducer(state = initialState, action: UserActions): State {
  switch (action.type) {

    case UserActionTypes.SetUser:
      return {
        user: action.payload,
        isAuthenticated: true,
        ...state
      };

    default:
      return state;
  }
}
