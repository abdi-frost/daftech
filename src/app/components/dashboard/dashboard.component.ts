import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState, Logout } from 'src/app/core/state/app.state';
import { FetchCars } from 'src/app/core/car/car.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  @Select(AuthState.user) user$!: Observable<any>;

  constructor(
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    // dispatch FetchCars with user id from user$ by subscribing to the user$ then dispatch inside
    
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.store.dispatch(new Logout());
  }
}
