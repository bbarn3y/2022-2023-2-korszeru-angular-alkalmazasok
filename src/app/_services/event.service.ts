import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  pageImageClicked: EventEmitter<{ title: string, counter: number }> = new EventEmitter<{title: string; counter: number}>();

  constructor() { }
}
