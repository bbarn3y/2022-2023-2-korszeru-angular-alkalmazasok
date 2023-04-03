import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthenticatedComponent} from "src/app/authenticated/authenticated.component";
import {PageComponent} from "src/app/book/page/page.component";
import {BookComponent} from "src/app/book/book.component";
import {ExamplePipe} from "src/app/_pipes/example.pipe";
import {SharedModule} from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    AuthenticatedComponent,
    PageComponent,
    BookComponent,
    ExamplePipe
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})

export class InnerModule { }
