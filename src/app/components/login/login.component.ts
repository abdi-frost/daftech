import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LoginData, AuthResponse } from 'src/app/core/auth/auth.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { AuthState, LoginAction, SetError } from 'src/app/core/state/app.state';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  @Select(AuthState.user) user$!: Observable<any>;
  @Select(AuthState.error) error$!: Observable<string>;
  @Select(AuthState.loading) loading$!: Observable<boolean>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.store.dispatch(new SetError("Missing Field"));
    if (this.loginForm.invalid) {
      this.error$ = of("Fill the empty field");
      return;
    }

    const loginData: LoginAction = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    // log console loginData
    
    // dispatch loginAction with username and password
    this.store.dispatch(new LoginAction(loginData.username, loginData.password));
  }
}
