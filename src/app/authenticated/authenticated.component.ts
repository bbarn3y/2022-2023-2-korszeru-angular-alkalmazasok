import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {EventService} from "src/app/_services/event.service";
import {interval, Subscription} from "rxjs";
import {DatePipe} from "@angular/common";
import {UserService} from "src/app/_services/user.service";
import {RouterService} from "src/app/_services/router.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticatedComponent implements OnInit, OnDestroy {
  currentTime: number = new Date().getTime();
  dateIntervalSub?: Subscription;
  constructor(private cdr: ChangeDetectorRef,
              private datePipe: DatePipe,
              private eventService: EventService,
              private routerService: RouterService,
              private translate: TranslateService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.eventService.pageImageClicked.subscribe((clickEvent) => {
      console.log('clickEvent', clickEvent);
    });

    this.dateIntervalSub = interval(1000).subscribe(() => {
      this.currentTime = new Date().getTime();
      this.cdr.detectChanges();
      console.log('Current time: ', this.datePipe.transform(this.currentTime));
    })
  }

  ngOnDestroy() {
    if (this.dateIntervalSub) {
      this.dateIntervalSub.unsubscribe();
    }
  }

  changeLanguage(langCode: string): void {
    this.translate.use(langCode);
  }

  logout(): void {
    this.userService.removeSession();
    this.routerService.routeToLogin();
  }

}
