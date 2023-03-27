import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EventService} from "src/app/_services/event.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ValidatorService} from "src/app/_services/validator.service";
import {TranslateService} from "@ngx-translate/core";
import {timeout} from "rxjs";

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.less']
})
export class PageComponent implements OnInit {
  @ViewChild('counter') counterEl?: ElementRef<HTMLElement>;
  @Input() title!: string;

  @Input() imageUrl!: string;

  @Input() index!: number;

  @Output() imageClicked: EventEmitter<number> = new EventEmitter<number>();

  @Output() toPrevious: EventEmitter<void> = new EventEmitter<void>();
  @Output() toNext: EventEmitter<void> = new EventEmitter<void>();

  clickCount: number = 0;

  pageForm: FormGroup;

  constructor(private eventService: EventService,
              private translate: TranslateService,
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
    window.setTimeout(() => {
      console.log('native', Object.assign({}, this.counterEl));
    }, 0)
    console.log('asd', this.counterEl);
    this.imageClicked.emit(this.clickCount);
    this.eventService.pageImageClicked.emit({ title: this.title, counter: this.clickCount });
  }

  save(): void {

  }

  translateStatus(status: string) {
    console.log('translate');
    return this.translate.instant(`BOOK.PAGE.STATUS.${status}`);
  }

}
