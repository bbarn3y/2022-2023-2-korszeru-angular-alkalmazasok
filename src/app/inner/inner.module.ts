import { NgModule } from '@angular/core';
import {PageComponent} from "src/app/book/page/page.component";
import {BookComponent} from "src/app/book/book.component";
import {ExamplePipe} from "src/app/_pipes/example.pipe";
import {HoverColorDirective} from "src/app/_directives/hover-color.directive";
import {AuthenticatedComponent} from "src/app/authenticated/authenticated.component";
import {SharedModule} from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    AuthenticatedComponent,
    PageComponent,
    BookComponent,
    ExamplePipe,
    HoverColorDirective
  ],
  imports: [
    SharedModule
  ]
})
export class InnerModule { }
