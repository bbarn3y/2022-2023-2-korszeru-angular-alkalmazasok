import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.less'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class BookComponent implements OnInit, OnDestroy {
  currentTime: number = new Date().getTime();
  pages: { imageUrl: string, title: string, counter?: number}[] = [
    {
      imageUrl: 'assets/images/katana.png',
      title: 'Katana'
    },
    {
      imageUrl: 'assets/images/sabre.png',
      title: 'Sabre'
    },
    {
      imageUrl: 'assets/images/star-wars.png',
      title: 'Light Sabre'
    }
  ];

  tableColumns: string[] = ['title', 'counter'];
  timeSubscription?: Subscription;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.timeSubscription = interval(1000).subscribe(() => {
      console.log('Getting current time...');
      this.currentTime = new Date().getTime();
      this.cdr.detectChanges();
    })

    // document.addEventListener('click', (event) => {
    //   this.pages[0].title = new Date().getTime() + ''
    // })
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  drawTable(title: string, counter: number) {
    console.log(title, counter);
    this.pages = this.pages.map((page) => {
      if (page.title === title) {
        page.counter = counter;
      }
      return page;
    });
  }

  shiftLeft() {
    const firstPage = this.pages.shift();
    if (firstPage) {
      this.pages.push(firstPage);
    }
  }

  shiftRight() {
    const lastPage = this.pages.pop()
    if (lastPage) {
      this.pages = [lastPage, ...this.pages];
    }
  }
}
