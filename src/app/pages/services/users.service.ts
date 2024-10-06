import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

interface user {
  email: string,
  evidence: string,
  first_name: string,
  id: number,
  last_name: string,
  national_code: string,
  phone: string,
  username: string,
  position: string
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = environment.apiUrl;
  }

  getReporters() {
    return this.http.get<user[]>(`${this.apiUrl}/reporters/`);
  }

  addReporter(data: any) {
    return this.http.post(`${this.apiUrl}/reporters/`, data);
  }

  deleteReporter(id: number) {
    return this.http.delete(`${this.apiUrl}/reporters/${id}/`);
  }

  changePassword(data: any) {
    return this.http.post(`${this.apiUrl}/auth/password/change/`, data);
  }
}
