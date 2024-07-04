import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from './car.model'; // (Define Car interface)

@Injectable({
  providedIn: 'root'
})

export class CarService {

  constructor(private http: HttpClient) {}
  
  // private baseUrl = "http://localhost:3000/car";
  private baseUrl = "https://daftech-api-abdi.up.railway.app/car";

  register(car: Car): Observable<any> {
    return this.http.post(`${this.baseUrl}/${car.userId}/cars`, car);
  }

  getCars(userId: number): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.baseUrl}/${userId}/cars`);
  }
}

