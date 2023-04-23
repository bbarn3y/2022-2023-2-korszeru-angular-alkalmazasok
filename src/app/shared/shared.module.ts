import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {HighlightDirective} from "src/app/_directives/highlight.directive";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";

const materialImports = [
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatTableModule,
  MatToolbarModule
]

@NgModule({
  declarations: [
    HighlightDirective
  ],
  imports: [
    ...materialImports,
    CommonModule,
    ReactiveFormsModule,
    ScrollingModule,
    TranslateModule
  ],
  exports: [
    ...materialImports,
    CommonModule,
    HighlightDirective,
    ReactiveFormsModule,
    ScrollingModule,
    TranslateModule
  ]
})
export class SharedModule { }
