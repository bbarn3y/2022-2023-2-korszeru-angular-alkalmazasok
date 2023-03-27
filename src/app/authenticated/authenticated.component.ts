import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EventService} from "src/app/_services/event.service";
import {RouterService} from "src/app/_services/router.service";
import {UserService} from "src/app/_services/user.service";
import {TranslateService} from "@ngx-translate/core";
import {BookComponent} from "src/app/book/book.component";

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.less']
})
export class AuthenticatedComponent implements OnInit {
  @ViewChild(BookComponent) bookEl?: BookComponent;

  constructor(private eventService: EventService,
              private routerService: RouterService,
              private translate: TranslateService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.eventService.pageImageClicked.subscribe((clickEvent) => {
      console.log('clickEvent', clickEvent);
    })
  }

  changeLanguage(languageCode: string): void {
    this.translate.use(languageCode);
  }


  logout(): void {
    this.userService.removeSession();
    this.routerService.routeToLogin();
  }

}
