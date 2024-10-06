import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, catchError, map, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/app/environments/environment';

export interface ngTreeNodes {
  title: string,
  key: string,
  children: ngTreeNodes[]
  isLeaf?: boolean
}
export interface treeNode {
  id: number,
  title: string,
  root_code: number
}

export interface addNode {
  title: string;
  root_code: number
}

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  apiUrl: string;

  constructor(
    private http: HttpClient
    ) {
    this.apiUrl = environment.apiUrl + "/trees";
  }

  getTree() {
    return this.http.get<treeNode[]>(`${this.apiUrl}/`)
  }

  getNgTree() {
    return this.http.get<treeNode[]>(`${this.apiUrl}/`)
      .pipe(
        map(res => {
          return this.makeNgTreeNodes(res, 0);
        })
      );
  }

  addNode(data: any) {
    return this.http.post(`${this.apiUrl}/`, data);
  }

  deleteNode(nodeId: any) {
    return this.http.delete(`${this.apiUrl}/${nodeId}/`);
  }

  makeNgTreeNodes(treeNodes: treeNode[], nodeId: number): ngTreeNodes[] {
    let tempArr: ngTreeNodes[] = []

    for (let i = 0; i < treeNodes.length; i++) {
      if (treeNodes[i].root_code === nodeId) {
        tempArr.push(
          {
            title: treeNodes[i].title,
            key: treeNodes[i].id.toString(),
            children: this.makeNgTreeNodes(treeNodes, treeNodes[i].id),
            isLeaf: this.isLeaf(treeNodes, treeNodes[i].id)
          }
        )
      }
    }
    return tempArr;
  }
  private isLeaf(treeNodes: treeNode[], id: number): boolean {
    for (let i = 0; i < treeNodes.length; i++) {
      if (treeNodes[i].root_code === id) return false;
    }
    return true
  }
}
