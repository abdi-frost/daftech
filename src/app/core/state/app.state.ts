import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AuthService } from '../auth/auth.service';
import { catchError, tap } from 'rxjs/operators'
import { of } from 'rxjs';



export class LoginAction {
    static readonly type = '[Auth] Login';
    constructor(public username: string, public password: string) { }
}

export class Logout {
    static readonly type = '[Auth] Logout';
}

export class LoginSuccess {
    static readonly type = '[Auth] Login Success';
    constructor(public user: any) { }
}

export class LoginFail {
    static readonly type = '[Auth] Login Fail';
    constructor(public message: string) { }
}

export class SetError {
    static readonly type = '[Auth] Set Error';
    constructor(public message: string) { }
}

export interface LoginStateModel {
    user: any;
    loading: boolean;
    error: string | null;
}

const defaults = {
    user: null,
    loading: false,
    error: null,
};

@State<LoginStateModel>({
    name: 'auth',
    defaults,
})

@Injectable()
export class AuthState {

    constructor(
        private authService: AuthService,
        private router: Router,
        private ngZone: NgZone
    ) { }

    @Selector()
    static user(state: LoginStateModel): string | null {
        return state.user;
    }

    @Selector()
    static loading(state: LoginStateModel): boolean {
        return state.loading;
    }

    @Selector()
    static error(state: LoginStateModel): string | null {
        return state.error;
    }

    @Action(LoginAction)
    login(ctx: StateContext<LoginStateModel>, action: LoginAction) {
        ctx.patchState({ loading: true, error: null });
        return this.authService.login(action).pipe(
            tap((res) => {
                ctx.patchState({ user: res.user, loading: false, error: null });
                this.ngZone.run(() => {
                    this.router.navigate(['/dashboard']);
                })
            }),
            catchError((error) => {
                console.log(error)
                return of(ctx.patchState({ user: null, loading: false, error: "Invalid username or pwd" }));
            })
        )
    }

    @Action(LoginSuccess)
    loginSuccess(ctx: StateContext<LoginStateModel>, action: LoginSuccess) {
        return ctx.patchState({
            user: action.user,
            loading: false,
            error: null,
        });
    }

    @Action(LoginFail)
    loginFail(ctx: StateContext<LoginStateModel>, action: LoginFail) {
        return ctx.patchState({
            loading: false,
            error: action.message,
        });
    }

    @Action(Logout)
    logout(ctx: StateContext<LoginStateModel>) {
        ctx.patchState({
            user: null,
            loading: false,
            error: null
        })
        this.router.navigate(['/login']);
    }

    @Action(SetError)
    setError(ctx: StateContext<LoginStateModel>, action: SetError) {
        return ctx.patchState({
            error: action.message
        })
    }
}



