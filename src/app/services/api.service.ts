import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Import environment

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Replace the base URL here if it changes again
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getBaseUrl() {
    return this.baseUrl;
  }

  // Example: Utility methods to interact with the API
  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, data: any) {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  // PUT request
  put<T>(endpoint: string, data: any, options?: any) {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, options);
  }

  // DELETE request
  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}
