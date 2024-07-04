import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthState} from '../state/app.state'; // Import token selector

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  @Select(AuthState.user) user$!: Observable<any | null>;

  constructor(private router: Router, private store: Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.user$.pipe(
      map((data) => {
        if (data) {
          return true; // Allow access if token exists
        } else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false; // Redirect to login if no token
        }
      })
    );
  }
}
