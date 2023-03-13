import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {UserService} from "src/app/_services/user.service";
import {Session} from "src/app/_models/session.model";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient,
              private userService: UserService) { }

  login(mail: string, password: string): Observable<Session> {
    return this.http
      .get<{token: string}>('https://mocki.io/v1/d40b594e-25d0-4464-b3a4-33df6ada51b5')
      .pipe(map((response) => {
        this.userService.saveSession(response.token);
        return new Session(response.token);
      }));
  }
}
