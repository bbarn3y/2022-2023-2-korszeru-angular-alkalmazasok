import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventService} from "src/app/_services/event.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ValidatorService} from "src/app/_services/validator.service";

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.less']
})
export class PageComponent implements OnInit {
  @Input() title!: string;

  @Input() imageUrl!: string;

  @Input() index!: number;

  @Output() imageClicked: EventEmitter<number> = new EventEmitter<number>();

  clickCount: number = 0;

  pageForm: FormGroup;

  constructor(private eventService: EventService,
              private validatorService: ValidatorService) {
    this.pageForm = new FormGroup<any>({
      status: new FormControl(true, [this.validatorService.nonNullValidator()]),
      name: new FormControl('', [])
    }, {
      validators: this.validatorService.nameConditionallyRequired()
    })
  }

  ngOnInit(): void {
  }

  onClick(): void {
    this.clickCount++;
    this.imageClicked.emit(this.clickCount);
    this.eventService.pageImageClicked.emit({ title: this.title, counter: this.clickCount });
  }

  save(): void {

  }

}
