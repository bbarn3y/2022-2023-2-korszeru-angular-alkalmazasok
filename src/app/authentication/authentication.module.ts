import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "src/app/login/login.component";
import {SharedModule} from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AuthenticationModule { }
