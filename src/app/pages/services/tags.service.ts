import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

interface tags {
  id: number,
  description: string,
  publish_date: string,
  title: string
}

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private apiUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = environment.apiUrl + '/tags'
  }

  addTag(data: any) {
    return this.http.post(`${this.apiUrl}/`, data);
  }

  deleteTag(id: any) {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }

  getTags() {
    return this.http.get<tags[]>(`${this.apiUrl}/`);
  }
}
