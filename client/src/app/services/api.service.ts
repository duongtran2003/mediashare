import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private rootUrl = "http://localhost:8000/"

  private http = inject(HttpClient);

  get(endpoint: string): Observable<any> {
    const url: string = this.rootUrl + endpoint;
    return this.http.get(url, {
      withCredentials: true,
    });
  }

  post(endpoint: string, data: any): Observable<any> {
    const url: string = this.rootUrl + endpoint;
    return this.http.post(url, data, {
      withCredentials: true,
    });
  }

}
