import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators'
import { of } from 'rxjs';
import { User } from '../user/user.model'
import { UserService } from '../user/user.service';
import { Car } from './car.model';
import { CarService } from './car.service';

export class RegisterCar {
    static type = '[Register] Register Car';
    constructor(
        // write using the User model
        public car: Car,
    ) { }
}

export class FetchCars {
    static type = '[Register] Fetch Cars';
    constructor(
        public userId: number
    ) {}
}

export class RegisterFailureAction {
    static type = '[Register] Register Failure';
    constructor(
        public error: string
    ) { }
}

export class SetError {
    static type = '[Register] Set Error';
    constructor(
        public error: string
    ) { }
}

export interface CarStateModel {
    cars: Car[] | null;
    car: Car | null,
    loading: boolean;
    error: string | null;
}


@State<CarStateModel>({
    name: 'car',
    defaults: {
        cars: [],
        car: null,
        loading: false,
        error: null
    }
})
@Injectable()
export class CarState {
    constructor(
        private router: Router,
        private carService: CarService
    ) { }

    @Selector()
    static cars(state: CarStateModel) {
        return state.cars;
    }

    @Selector()
    static car(state: CarStateModel) {
        return state.car;
    }

    @Selector()
    static loading(state: CarStateModel) {
        return state.loading;
    }

    @Selector()
    static error(state: CarStateModel) {
        return state.error;
    }

    @Action(RegisterCar)
    registerCar(ctx: StateContext<CarStateModel>, action: RegisterCar) {
        ctx.patchState({ loading: true, error: null });
        return this.carService.register(action.car).pipe(
            tap((res) => {
                ctx.patchState({ car: res.car, loading: false, error: null });
                // dispatch fetchCars with car.userid as arg
                ctx.dispatch(new FetchCars(res.car.userId))
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

    @Action(SetError)
    setError(ctx: StateContext<CarStateModel>, action: SetError) {
        ctx.patchState({ error: action.error });
    }

    @Action(FetchCars)
    fetchCars(ctx: StateContext<CarStateModel>, action: FetchCars) {
        ctx.patchState({ loading: true, error: null });
        return this.carService.getCars(action.userId).pipe(
            tap((res) => {
                ctx.patchState({ cars: res, loading: false, error: null });
            }),
            catchError((error) => {
                console.log(error)
                return of(ctx.patchState({
                    loading: false,
                    error: error.error?.message || "User couldn't be Registered"
                }));
            })
        );
    }

}