import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators'
import { of } from 'rxjs';
import { User } from '../user/user.model'
import { UserService } from '../user/user.service';

export class RegisterAction {
    static type = '[Register] Register';
    constructor(
        // write using the User model
        public user: User
    ) { }
}

export class RegisterSuccessAction {
    static type = '[Register] Register Success';
    constructor(
        public user: User
    ) { }
}

export class RegisterFailureAction {
    static type = '[Register] Register Failure';
    constructor(
        public error: string
    ) { }
}

export interface UserStateModel {
    user: User | null;
    loading: boolean;
    error: string | null;
}


@State<UserStateModel>({
    name: 'user',
    defaults: {
        user: null,
        loading: false,
        error: null
    }
})
@Injectable()
export class UserState {
    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    @Selector()
    static user(state: UserStateModel) {
        return state.user;
    }

    @Selector()
    static loading(state: UserStateModel) {
        return state.loading;
    }

    @Selector()
    static error(state: UserStateModel) {
        return state.error;
    }

    @Action(RegisterAction)
    registerAction(ctx: StateContext<UserStateModel>, action: RegisterAction) {
        ctx.patchState({ loading: true, error: null});
        return this.userService.register(action.user).pipe(
            tap((res) => {
                ctx.patchState({ user: res.user, loading: false, error: null });
                this.router.navigate(['/login']);
            }),
            catchError((error) => {
                console.log(error)
                return of(ctx.patchState({
                    loading: false,
                    error: error.error?.message || "User couldn't be Registered"
                }));
            })
        )
    }



}