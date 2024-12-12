import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';

@Component({
  selector: 'app-in-progress-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './in-progress-tickets.component.html',
  styleUrl: './in-progress-tickets.component.css'
})
export class InProgressTicketsComponent {
  ptickets: any[] =[];
  adminResponse = '';
  // Selected ticket for editing
  selectedTicket: any = null;
  adminid = 0;
  http = inject(HttpClient);
  userService = inject(UserService);
  ngOnInit(): void {
    this.adminid = this.userService.getAdminId();
    this.ProgressTickets();
    
  }

  // Fetch in-progress tickets from API
  ProgressTickets(): void {
    this.http.get<any[]>(`https://localhost:7297/api/Ticket/in-progress-tickets/${this.adminid}`).subscribe(
      (response) => {
        this.ptickets = response; // Assign response data to tickets
      },
      (error) => {
        console.error('Error fetching in-progress tickets:', error);
      }
    );
  }

  
  
  updateTicket(ticket_id: number, status?: string, message?: string) {
    // API endpoint for updating the ticket
    const apiUrl = `https://localhost:7297/api/Ticket/update-ticket/${ticket_id}`;
  
    // Create the update payload, only including non-null values
    const updateRequest: any = {};
    if (status) updateRequest.status = status;
    if (message) updateRequest.message = message;
  
    // HTTP PUT request to update the ticket
    this.http.put(apiUrl, updateRequest, { responseType: 'text' }).subscribe(
      (response) => {
        alert('Ticket updated successfully!');
        this.closePopup(); // Close the popup after successful update
        this.ProgressTickets(); // Refresh the tickets list
      },
      (error) => {
        console.error('Error updating ticket:', error);
        alert(`Failed to update the ticket. Error: ${error.message || error.statusText}`);
      }
    );
  }

  // Open popup with selected ticket
  openPopup(ticket: any): void {
    this.selectedTicket = { ...ticket }; // Clone ticket to avoid reference issues
  }

  // Close popup without saving
  closePopup(): void {
    this.selectedTicket = null;
  }

  // Handle Resolve button click
  resolveTicket(): void {
    if (this.selectedTicket) {
      this.updateTicket(this.selectedTicket.ticket_id, 'resolved', this.adminResponse);
    }
  }
}
