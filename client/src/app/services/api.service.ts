import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, debounceTime, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private rootUrl = "http://localhost:8000/"

  constructor(private http: HttpClient) { }

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
