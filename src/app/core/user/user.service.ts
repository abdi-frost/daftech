import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model'; // (Define User interface)

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // public baseUrl = 'http://localhost:3000/';
  private baseUrl = "https://daftech-api-abdi.up.railway.app/";

  constructor(private http: HttpClient) {}
  // getUser(userId: string): Observable<User> {}
  
  register(user: User): Observable<any> {
    return this.http.post(this.baseUrl + 'users/register', user);
  }


}
