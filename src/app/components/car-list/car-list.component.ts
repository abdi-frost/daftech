import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs';
import { Car } from 'src/app/core/car/car.model';
import { CarState, FetchCars, RegisterCar, SetError } from 'src/app/core/car/car.state';
import { AuthState } from 'src/app/core/state/app.state';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {

  @Select(AuthState.user) user$!: Observable<any>;
  @Select(CarState.cars) cars$!: Observable<any>;
  @Select(CarState.loading) loading$!: Observable<any>;
  @Select(CarState.error) error$!: Observable<any>;

  carForm!: FormGroup;
  showRegisterForm: boolean = false;

  constructor(
    private router: Router,
    private store: Store,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.carForm = this.fb.group({
      model: ['', Validators.required],
      year: ['', Validators.required],
      plateNumber: ['', Validators.required],
      color: ['', Validators.required],
    })
    
    this.user$.subscribe((user) => {
      this.store.dispatch(new FetchCars(user.id));
    });

  }

  onBack(): void {
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    // check if the form is invalid if so dispatch set Error with empty field message
    if (this.carForm.invalid)
      this.store.dispatch(new SetError('Please fill all the fields'))



    // dispatch regiter car with argmunes car and userId from user$ by susbcribing to user$ first
    this.user$.subscribe((user) => {
      // const car var to save every property  from form
      const car: Car = {
        userId: user.id,
        model: this.carForm.value.model,
        year: this.carForm.value.year,
        plateNumber: this.carForm.value.plateNumber,
        color: this.carForm.value.color,
      }

      this.store.dispatch(new RegisterCar(car));
    })

    this.carForm.reset();
  }

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }

}
