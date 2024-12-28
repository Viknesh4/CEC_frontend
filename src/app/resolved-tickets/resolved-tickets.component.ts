import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminService } from '../admin.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-resolved-tickets',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './resolved-tickets.component.html',
  styleUrl: './resolved-tickets.component.css',
})
export class ResolvedTicketsComponent {
  rtickets: any[] = [];
  paginatedTickets: any[] = [];
  currentPage: number = 1;
  ticketsPerPage: number = 8;

  adminid = 0;

  users: any[] = [];

  constructor(private apiService: ApiService) {}

  http = inject(HttpClient);
  adminService = inject(AdminService);

  ngOnInit(): void {
    this.adminid = this.adminService.getAdminId();
    this.ResolvedTickets();
    this.fetchUsersData();
  }

  ResolvedTickets(): void {
    const endpoint = `api/Ticket/resolved/${this.adminid}`;

  // Use ApiService to fetch resolved tickets
  this.apiService.get<any[]>(endpoint).subscribe(
        (response) => {
          this.rtickets = response;
          this.updatePaginatedTickets();
        },
        (error) => {
          console.error('Error fetching resolved tickets:', error);
        }
      );
  }

  fetchUsersData(): void {
    const endpoint = 'api/User'; // Endpoint for fetching users

  // Use ApiService to fetch users data
  this.apiService.get<any[]>(endpoint).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  getUserNameById(userId: number): string {
    const user = this.users.find((u) => u.user_id === userId);
    return user ? user.name : 'Unknown';
  }

  // Pagination logic
  updatePaginatedTickets(): void {
    const startIndex = (this.currentPage - 1) * this.ticketsPerPage;
    const endIndex = startIndex + this.ticketsPerPage;
    this.paginatedTickets = this.rtickets.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedTickets();
  }

  get totalPages(): number {
    return Math.ceil(this.rtickets.length / this.ticketsPerPage);
  }
}
