import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-viewtickets',
  imports: [HttpClientModule],
  templateUrl: './viewtickets.component.html',
  styleUrl: './viewtickets.component.css'
})
export class ViewticketsComponent {
  private apiUrlT = 'https://localhost:7297/api/Ticket';
  tickets:any[]=[];
  totalQueries: number = 0;

  http = inject(HttpClient)

  fetchTicketsData(): void {
    this.http.get<any[]>(this.apiUrlT).subscribe({
      next: (data) => {
        this.tickets = data;
        this.totalQueries = data.length;
      }
  });
  }
}
