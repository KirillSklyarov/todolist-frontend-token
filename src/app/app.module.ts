import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TodolistComponent } from './components/todolist/todolist.component';
// import { AppRoutingModule } from './app-routing.module';
import { CreateitemComponent } from './components/createitem/createitem.component';
import { NgbModalModule, NgbTabsetModule, NgbPaginationModule,
  NgbTypeaheadModule, NgbAlertModule, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { DeleteComponent } from './components/delete/delete.component';
import { StopDirective } from './directives/stop.directive';

@NgModule({
  declarations: [
    AppComponent,
    TodolistComponent,
    CreateitemComponent,
    ProfileComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    DeleteComponent,
    StopDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModalModule,
    NgbTabsetModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbAlertModule,
    NgbDatepickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CreateitemComponent, RegisterComponent, LoginComponent,
    LogoutComponent, DeleteComponent]
})
export class AppModule { }
