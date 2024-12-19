import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminService } from '../admin.service';
@Component({
  selector: 'app-resolved-tickets',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './resolved-tickets.component.html',
  styleUrl: './resolved-tickets.component.css'
})
export class ResolvedTicketsComponent {
  rtickets: any[] =[];
  adminid = 0;
  apiUrlU: string  = "https://localhost:7297/api/User";
  users: any[]= [];
  
  http = inject(HttpClient);
  adminService = inject(AdminService);
  ngOnInit(): void {
    this.adminid = this.adminService.getAdminId();
    this.ResolvedTickets();
    this.fetchUsersData();
  }

  // Fetch in-progress tickets from API
  ResolvedTickets(): void {
    this.http.get<any[]>(`https://localhost:7297/api/Ticket/resolved/${this.adminid}`).subscribe(
      (response) => {
        this.rtickets = response; // Assign response data to tickets
      },
      (error) => {
        console.error('Error fetching resolved tickets:', error);
      }
    );
  }

  fetchUsersData(): void {
    this.http.get<any[]>(this.apiUrlU).subscribe({
      next: (data) => {
        this.users = data;
      }
  });
  }

  getUserNameById(userId: number): string {
    const user = this.users.find((u) => u.user_id === userId);
    return user ? user.name : 'Unknown'; // Return "Unknown" if user is not found
  }
}
