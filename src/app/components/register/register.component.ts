import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

// Import your user model and any required services
import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service'; // Assuming user service
import { UserState } from 'src/app/core/state/user.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

// import actions classes
import {
  RegisterState,
  RegisterAction,
  SavePersonalDetail,
  SaveContactDetail,
  SaveSpouseInfo,
  SaveCredentials,
  SetCurrentStep
} from 'src/app/core/register/register.state';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  personalDetails!: FormGroup<any>;
  contactDetails!: FormGroup<any>;
  spouseInfo!: FormGroup<any>;
  credentials!: FormGroup<any>;

  isLinear = false; // Adjust for linear or non-linear steps
  totalSteps = 4; // Four steps for your form structure
  progress:any = 1;
  
  // state data
  @Select(RegisterState.user) user$!: Observable<any>;
  @Select(RegisterState.error) error$!: Observable<string>;
  @Select(RegisterState.loading) loading$!: Observable<boolean>;
  @Select(RegisterState.currentStep) currentStep$!: Observable<number>;
  @Select(RegisterState.personalDetails) personalDetails$!: Observable<any>;
  @Select(RegisterState.contactDetails) contactDetails$!: Observable<any>;
  @Select(RegisterState.spouseInfo) spouseInfo$!: Observable<any>;
  @Select(RegisterState.credentials) credentials$!: Observable<any>;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit() {
    this.personalDetails$.subscribe(data => {
      this.personalDetails = this.fb.group({
        firstName: [data.firstName || '', Validators.required],
        lastName: [data.lastName || '', Validators.required],
        dateOfBirth: [ data.dateOfBirth || '', Validators.required],
        gender: [ data.gender || '', Validators.required], // Assuming gender is required
      })
    })

    this.contactDetails$.subscribe(data => {
      this.contactDetails = this.fb.group({
        email: [data.email || '', Validators.required],
        phoneNumber: [data.phoneNumber || '', Validators.required], // Optional phone number
        address: [data.address || '', Validators.required], // Add address fields
      })
    })

    this.spouseInfo$.subscribe(data => {
      this.spouseInfo = this.fb.group({
        spouseFirstName: [data.spouseFirstName || ''], // Optional spouse first name
        spouseLastName: [data.spouseLastName || ''], // Optional spouse last name
        relationshipStartDate: [data.relationshipStartDate || ''], // Optional relationship start date
      })
    })

    this.credentials$.subscribe(data => {
      this.credentials = this.fb.group({
        username: [data.username || '', [Validators.required, Validators.minLength(4)]], // Optional username
        password: [data.password || '', [Validators.required, Validators.minLength(8)]], // Optional password
      })
    })

  }

  onSubmit() {
    const user: User = {
      // Map form values to user model object
      firstName: this.personalDetails.value?.firstName,
      lastName: this.personalDetails.value?.lastName,
      dateOfBirth: this.personalDetails.value?.dateOfBirth,
      gender: this.personalDetails.value?.gender,
      
      email: this.contactDetails.value?.email,
      phoneNumber: this.contactDetails.value?.phoneNumber,
      address: this.contactDetails.value?.address,
      
      // profilePicture: this.profilePicture.value?.url,
      
      spouseFirstName: this.spouseInfo.value?.spouseFirstName,
      spouseLastName: this.spouseInfo.value?.spouseLastName,
      relationshipStartDate: this.spouseInfo.value?.relationshipStartDate,
      
      username: this.credentials.value?.username,
      password: this.credentials.value?.password,
    };    

    console.log(user)
    this.store.dispatch(new RegisterAction(user));
  }

  // rewrite onStepChange function to dispach any changes to the form when next is clicked
  onStepChange(event: any) {
    // switch the selectedIndex values to dispach diff actions accordingly
    switch (event.selectedIndex) {
      case 1:
        this.store.dispatch(new SavePersonalDetail({
          firstName: this.personalDetails.value.firstName,
          lastName: this.personalDetails.value.lastName,
          dateOfBirth: this.personalDetails.value.dateOfBirth,
          gender: this.personalDetails.value.gender,
        }));
        break;
      case 2:
        this.store.dispatch(new SaveContactDetail({
          email: this.contactDetails.value?.email,
          phoneNumber: this.contactDetails.value?.phoneNumber,
          address: this.contactDetails.value?.address,
        }));
        break;
      case 3:
        this.store.dispatch(new SaveSpouseInfo({
          spouseFirstName: this.spouseInfo.value?.spouseFirstName,
          spouseLastName: this.spouseInfo.value?.spouseLastName,
          relationshipStartDate: this.spouseInfo.value?.relationshipStartDate,
        }));
        break;
      case 4:
        this.store.dispatch(new SaveCredentials({
          username: this.credentials.value?.username,
          password: this.credentials.value?.password,
        }));
        break;
    }

    // this.currentStep = event.selectedIndex;
    this.store.dispatch(new SetCurrentStep(event.selectedIndex))
    this.progress = ((event.selectedIndex / (this.totalSteps - 1)) * 100).toFixed(2);
    // console.log(this.progress)
  }

  onBack(): void {
    this.router.navigate(['/login']);
  }

  onPrevStep() {
    this.currentStep$.pipe(take(1)).subscribe(data => {
      if (data > 0) {
        this.store.dispatch(new SetCurrentStep(data - 1));
        this.progress = data * 25;
      }
    });
  }
  

}
