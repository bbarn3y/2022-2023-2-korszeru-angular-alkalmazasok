import { Component, OnInit } from '@angular/core';
import {EventService} from "src/app/_services/event.service";

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.less']
})
export class AuthenticatedComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.pageImageClicked.subscribe((clickEvent) => {
      console.log('clickEvent', clickEvent);
    })
  }

}
