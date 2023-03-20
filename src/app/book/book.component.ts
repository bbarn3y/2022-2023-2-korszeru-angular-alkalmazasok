import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.less']
})
export class BookComponent implements OnInit {
  imageUrls: string[] = [
    'assets/images/branch.webp',
    'assets/images/master-sword.jpg',
    'assets/images/master-sword-clickable.png'
  ];

  moveCounter: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  stepRight() {
    const firstImage = this.imageUrls.shift();
    if (firstImage) {
      this.imageUrls.push(firstImage);
    }
  }

}
