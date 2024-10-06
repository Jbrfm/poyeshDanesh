import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

export interface Knowledge {
  id: number,
  title: string,
  position: string,
  start: string,
  end: string,
  interview_date: string,
  interview_text: string,
  created_at: string,
  reporter: number,
  tree: number
}

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {
  private apiUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = environment.apiUrl;
  }

  getKnowledges() {
    return this.http.get(`${this.apiUrl}/interviews/`);
  }

  addKnowledge(data: any) {
    return this.http.post(`${this.apiUrl}/interviews/`, data);
  }

  uploadFile(data: any) {
    return this.http.post(`${this.apiUrl}/archives/`, data);
  }
}
