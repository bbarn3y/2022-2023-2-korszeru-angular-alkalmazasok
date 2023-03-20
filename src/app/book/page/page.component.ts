import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ValidatorService} from "src/app/_services/validator.service";
import {ExamplePipe} from "src/app/_pipes/example.pipe";

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.less']
})
export class PageComponent implements OnInit, OnChanges {
  @Input() imageUrl!: string;
  @Input() index!: number;

  moveCounter: number = 0;

  pageForm: FormGroup;

  constructor(private fb: FormBuilder,
              private examplePipe: ExamplePipe,
              private validatorService: ValidatorService) {
    this.pageForm = this.fb.group({
      status: new FormControl(false, [this.validatorService.nonNullValidator()]),
      name: new FormControl('', [])
    }, {
      validators: this.validatorService.statusNameValidator()
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['index'] && !changes['index'].firstChange) {
      this.moveCounter++;
    }
  }

  save() {
    // @todo emit event!
  }

}
