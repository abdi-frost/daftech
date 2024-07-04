import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { AuthState } from './core/state/app.state';
import { UserState } from './core/state/user.state';
import { CarState } from './core/car/car.state';
import { RegisterState } from './core/register/register.state';

// 
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    CarListComponent,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxsModule.forRoot([AuthState, UserState, CarState, RegisterState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
      keys: ['car', 'auth', 'user', 'register']
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
