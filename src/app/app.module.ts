import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {HttpClientModule} from "@angular/common/http";
import { BookComponent } from './book/book.component';
import { PageComponent } from './book/page/page.component';
import {MatSelectModule} from "@angular/material/select";
import { ExamplePipe } from './_pipes/example.pipe';
import { ExampleDirective } from './_directive/example.directive';

const materialImports = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule
]

@NgModule({
  declarations: [
    AppComponent,
    AuthenticatedComponent,
    BookComponent,
    LoginComponent,
    PageComponent,
    ExamplePipe,
    ExampleDirective
  ],
  imports: [
    ...materialImports,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    ExamplePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
