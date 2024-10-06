import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment';

interface loginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    handler: HttpBackend
  ) {
    this.apiUrl = environment.apiUrl;
    this.http = new HttpClient(handler);
  }

  login(credentials: any) {
    return this.http.post<loginResponse>(`${this.apiUrl}/auth/login/`, credentials)
      .pipe(
        tap(
          (res: any) => {
            this.setToken(res.key)
            return res;
          })
      )
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout/`, {})
      .pipe(
        tap(() => {
          this.removeToken();
          this.router.navigateByUrl("/login")
        })
      );
  }

  isLogedin() {
    this.http.get(`${this.apiUrl}/tags/`)
      .subscribe(res => {
        console.log(res);
      })
  }

  private removeToken() {
    sessionStorage.removeItem('token');
  }

  private setToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }
}
