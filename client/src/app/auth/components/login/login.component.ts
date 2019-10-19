import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { State } from '../../../store/root/reducers';
import { Store } from '@ngrx/store';
import { SetUser } from '../../../user/store/actions/user.actions';
import { User } from '../../../user/interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<State>
  ) {
  }

  ngOnInit() {
    this.loginForm = this.createForm();
  }

  doLogin() {
    this.authService.authenticateUser({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    })
      .subscribe((token) => {
        this.store.dispatch(new SetUser(token.user));
        this.router.navigate(['']);
      });
  }

  createForm() {
    return this.fb.group({
      username: [
        'user',
        [Validators.required]
      ],
      password: [
        'pass',
        [Validators.required]
      ]
    });
  }

  playAsGuest() {
    this.authService.register()
      .subscribe((token) => {
        this.store.dispatch(new SetUser(token.user));
        this.router.navigate(['']);
      });
  }
}
