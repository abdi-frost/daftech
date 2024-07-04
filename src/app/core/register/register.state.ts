import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators'
import { of } from 'rxjs';
import { User } from '../user/user.model'
// import userService
import { UserService } from '../user/user.service';

export class RegisterAction {
    static type = '[Register] Register';
    constructor(
        // write using the User model
        public user: User
    ) { }
}

export class SavePersonalDetail {
    static type = '[Register] Save Personal Detail';
    constructor(
        // define personalDetails with type firstName, lastName, dateOfBirth and gender all strings
        public personalDetails: {
            firstName: string;
            lastName: string;
            dateOfBirth: string;
            gender: string;
        }
    ) { }
}

export class SaveContactDetail {
    static type = '[Register] Save Contact Detail';
    constructor(
        public contactDetails: {
            email: string;
            phoneNumber: string;
            address: string;
        }
    ) { }
}

export class SaveSpouseInfo {
    static type = '[Register] Save Spouse Info';
    constructor(
        public spouseInfo: {
            spouseFirstName: string;
            spouseLastName: string;
            relationshipStartDate: string;
        }
    ) { }
}

export class SaveCredentials {
    static type = '[Register] Save Credentials';
    constructor(
        public credentials: {
            username: string;
            password: string;
        }
    ) { }
}

export class SetCurrentStep {
    static type = '[Register] Set Current Step';
    constructor(
        public currentStep: number
    ) { }

}

export interface RegisterStateModel {
    personalDetails: {
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        gender: string;
    }
    contactDetails: {
        email: string;
        phoneNumber: string;
        address: string;
    
    }
    spouseInfo: {
        spouseFirstName: string;
        spouseLastName: string;
        relationshipStartDate: string;
    }
    credentials: {
        username: string;
        password: string;
    },
    currentStep: number;
    user: User | null;
    loading: boolean;
    error: string | null;
}

@State<RegisterStateModel>({
    name: 'register',
    defaults: {
        personalDetails: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: ''
        },
        contactDetails: {
            email: '',
            phoneNumber: '',
            address: ''
        },
        spouseInfo: {
            spouseFirstName: '',
            spouseLastName: '',
            relationshipStartDate: ''
        },
        credentials: {
            username: '',
            password: ''
        },
        currentStep: 0,
        user: null,
        loading: false,
        error: null
    }
})

@Injectable()
export class RegisterState {
    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    @Selector()
    static personalDetails(state: RegisterStateModel) {
        return state.personalDetails;
    }

    @Selector()
    static contactDetails(state: RegisterStateModel) {
        return state.contactDetails;
    }

    @Selector()
    static spouseInfo(state: RegisterStateModel) {
        return state.spouseInfo;
    }

    @Selector()
    static credentials(state: RegisterStateModel) {
        return state.credentials;
    }

    @Selector()
    static currentStep(state: RegisterStateModel) {
        return state.currentStep;
    }

    @Selector()
    static user(state: RegisterStateModel) {
        return state.user;
    }

    @Selector()
    static loading(state: RegisterStateModel) {
        return state.loading;
    }

    @Selector()
    static error(state: RegisterStateModel) {
        return state.error;
    }

    @Action(SavePersonalDetail)
    savePersonalDetail({ patchState }: StateContext<RegisterStateModel>, { personalDetails }: SavePersonalDetail) {
        patchState({ personalDetails });
    }

    @Action(SaveContactDetail)
    saveContactDetail({ patchState }: StateContext<RegisterStateModel>, { contactDetails }: SaveContactDetail) {
        patchState({ contactDetails });
    }

    @Action(SaveSpouseInfo)
    saveSpouseInfo({ patchState }: StateContext<RegisterStateModel>, { spouseInfo }: SaveSpouseInfo) {
        patchState({ spouseInfo });
    }

    @Action(SaveCredentials)
    saveCredentials({ patchState }: StateContext<RegisterStateModel>, { credentials }: SaveCredentials) {
        patchState({ credentials });
    }

    // action to change currentStep
    @Action(SetCurrentStep)
    setCurrentStep({ patchState }: StateContext<RegisterStateModel>, { currentStep }: SetCurrentStep) {
        patchState({ currentStep });
    }
    
    @Action(RegisterAction)
    registerAction(ctx: StateContext<RegisterStateModel>, action: RegisterAction) {
        // write logic to register user
        ctx.patchState({ loading: true, error: null});
        return this.userService.register(action.user).pipe(
            tap((res) => {
                ctx.patchState({ 
                    user: res.user, 
                    loading: false, 
                    error: null,
                    personalDetails: {
                        firstName: '',
                        lastName: '',
                        dateOfBirth: '',
                        gender: ''
                    },
                    contactDetails: {
                        email: '',
                        phoneNumber: '',
                        address: ''
                    },
                    spouseInfo: {
                        spouseFirstName: '',
                        spouseLastName: '',
                        relationshipStartDate: ''
                    },
                    credentials: {
                        username: '',
                        password: ''
                    },
                    currentStep: 0
                 });

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
