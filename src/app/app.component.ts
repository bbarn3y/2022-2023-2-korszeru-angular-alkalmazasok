import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = '2022-2023-2-korszeru';

  defaultTitle = false;
  secondaryTitle = 'Secondary'

  changeTitle() {
    this.defaultTitle = !this.defaultTitle;
  }
}
