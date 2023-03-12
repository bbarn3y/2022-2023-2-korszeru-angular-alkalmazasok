import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {delay, map, Observable, of} from "rxjs";
import {UserService} from "src/app/services/user.service";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // https://mocki.io/
  constructor(private http: HttpClient,
              private userService: UserService) { }

  login(mail: string, password: string): Observable<{ token: string }> {
    // return this.http.get<{ token: string }>('https://mocki.io/v1/fbf903e7-0913-47f2-89d3-bf30ac2f58fa')

    return of({ token: 'MyLittleSessionToken' })
      .pipe(delay(2000))
      .pipe(map(response => {
        this.userService.setToken(response.token)
        return response;
      }))
  }
}
