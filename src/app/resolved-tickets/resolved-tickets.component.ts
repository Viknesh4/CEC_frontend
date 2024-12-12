import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
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
  http = inject(HttpClient);
  userService = inject(UserService);
  ngOnInit(): void {
    this.adminid = this.userService.getAdminId();
    this.ResolvedTickets();
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
}
