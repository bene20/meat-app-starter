import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { MEAT_API } from 'app/app.api';
import { User } from './user.model';

import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class LoginService {

  user: User;
  lastUrl: string;

  constructor(private http: HttpClient,
              private router: Router) {
    // Abaixo me inscrevo em todos os eventos do Router (todas as navegações) e salvo sempre a última rota acessada
    this.router.events
              .pipe(filter(e => e instanceof NavigationEnd))
               .subscribe((e: NavigationEnd) => this.lastUrl = e.url);
  }

  isLoggedIn(): boolean {
    return this.user !== undefined;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${MEAT_API}/login`, {email: email, password: password})
                    .pipe(tap(user => this.user = user));
  }

  handleLogin(path: string = this.lastUrl) {
    this.router.navigate(['/login', btoa(path)]); // btoa é uma função de encoding para base64
  }

  logout() {
    this.user = undefined;
  }
}
