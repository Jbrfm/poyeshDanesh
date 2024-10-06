import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

interface addRequest {
  title: string,
  Reporter: string,
  Description: string,
  user: string,
  tree: string
}

interface addExperienceResposnse {
  description: string,
  experience_date: string,
  id: number,
  is_success: boolean,
  reporter: string,
  subject: string,
  tags: any,
  title: string,
  tree: number,
  user: number
}

interface request {
  id: number,
  tags: [],
  title: string,
  subject: string,
  experience_date: string,
  reason: string,
  decision: string,
  achievement: string,
  is_success: boolean,
  description: string,
  created_at: string,
  reporter: number,
  tree: number
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  apiUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = environment.apiUrl;
  }

  addReport(data: any) {
    return this.http.post(`${this.apiUrl}/reports/`, data);
  }

  getReports() {
    return this.http.get(`${this.apiUrl}/reports/`);
  }

  addExperience(data: any) {
    return this.http.post<addExperienceResposnse>(`${this.apiUrl}/experiences/`, data);
  }

  addExperienceTag(data: any) {
    return this.http.post(`${this.apiUrl}/tags-mapto-reports-experiences/`, data);
  }

  getExperience() {
    return this.http.get<request[]>(`${this.apiUrl}/experiences/`);
  }

  uploadFile(data: any) {
    return this.http.post(`${this.apiUrl}/repositories/`, data)
  }
}
