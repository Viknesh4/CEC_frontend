import { Component, inject } from '@angular/core';

import { UserService } from '../user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
 // Import the directive

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [HttpClientModule],  // Add BaseChartDirective to imports
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  newtickets = 0;
  resolvedtickets = 0;
  userService = inject(UserService);
  http = inject(HttpClient)
  adminid = 0;
  ptickets = 0;
  rtickets = 0;
  admin_type = " ";
  apiURL: string = "https://localhost:7297/api/Ticket/Login";
  tickets = 0;
  ngOnInit(): void {
    this.admin_type = this.userService.getAdmintype();
    this.getNewTickets();
    this.adminid = this.userService.getAdminId();
    this.ProgressTickets();
    this.ResolvedTickets();

  }

  ProgressTickets(): void {
    this.http.get<any[]>(`https://localhost:7297/api/Ticket/in-progress-tickets/${this.adminid}`).subscribe(
      (response) => {
        this.ptickets = response.length; // Assign response data to tickets
      },
      (error) => {
        console.error('Error fetching in-progress tickets:', error);
      }
    );
  }

  ResolvedTickets(): void {
    this.http.get<any[]>(`https://localhost:7297/api/Ticket/resolved/${this.adminid}`).subscribe(
      (response) => {
        this.rtickets = response.length; // Assign response data to tickets
      },
      (error) => {
        console.error('Error fetching resolved tickets:', error);
      }
    );
  }

  getNewTickets(): void {
    this.http.get<any[]>(`${this.apiURL}/${this.admin_type}`).subscribe(
      (data) => {
        this.tickets = data.length; // Set the tickets data
      },
      (error) => {
        console.error('Error fetching new tickets', error);
      }
    );
  }
}
