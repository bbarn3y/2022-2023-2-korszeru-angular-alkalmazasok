import { Component, OnInit } from '@angular/core';
import {count} from "rxjs";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.less']
})
export class BookComponent implements OnInit {
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

  constructor() { }

  ngOnInit(): void {
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

  toNextPage() {
    const lastPage = this.pages.pop();
    if (lastPage) {
      this.pages = [lastPage, ...this.pages];
    }
  }

  toPreviousPage() {
    const firstPage = this.pages.shift();
    if (firstPage) {
      this.pages.push(firstPage);
    }
  }
}
