import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import {MatFormFieldModule} from '@angular/material/form-field';

const materialImports = [
  MatFormFieldModule
]

@NgModule({
  declarations: [
    AppComponent,
    AuthenticatedComponent,
    LoginComponent
  ],
  imports: [
    ...materialImports,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
