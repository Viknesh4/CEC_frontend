import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrlE = 'https://localhost:7297/api/Email/send'; // Replace with your ASP.NET API URL
  http = inject(HttpClient);
  sendEmail(email: { to: string; subject: string; body: string }): Observable<any> {
    return this.http.post(this.apiUrlE, email);
  }
}
