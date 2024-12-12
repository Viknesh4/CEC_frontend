import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
@Component({
  selector: 'app-new-tickets',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './new-tickets.component.html',
  styleUrl: './new-tickets.component.css'
})
export class NewTicketsComponent {
  tickets: any[] = []; // This will hold the new tickets fetched from API
  selectedTicket: any = null; // To store the selected ticket details
  adminResponse = ''; // Admin response field
  selectedAdminCategory: string = ''; // Holds the selected admin category
  admin_type = '';
  adminType = '';
  adminCategories: string[] = ['G', 'L', 'T'];
  userService = inject(UserService);
  http = inject(HttpClient);
  apiURL: string = "https://localhost:7297/api/Ticket/Login";

  ngOnInit(): void {
    this.admin_type = this.userService.getAdmintype();
    this.getNewTickets();
    this.adminType = (this.admin_type === "T") ? "Technical" :
            (this.admin_type === "G") ? "General" :
            (this.admin_type === "L") ? "Logistics" : "";
  }

  // Fetch new tickets from the API
  getNewTickets(): void {
    this.http.get<any[]>(`${this.apiURL}/${this.admin_type}`).subscribe(
      (data) => {
        this.tickets = data; // Set the tickets data
      },
      (error) => {
        console.error('Error fetching new tickets', error);
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
    if (this.userService.getAdminId()) updateRequest.assigned_admin_id = this.userService.getAdminId();
  
    // HTTP PUT request to update the ticket
    this.http.put(apiUrl, updateRequest, { responseType: 'text' }).subscribe(
      (response) => {
        alert('Ticket updated successfully!');
        this.closePopup(); // Close the popup after successful update
        this.getNewTickets(); // Refresh the tickets list
      },
      (error) => {
        console.error('Error updating ticket:', error);
        alert(`Failed to update the ticket. Error: ${error.message || error.statusText}`);
      }
    );
  }
  

  // Forward the ticket to a selected admin category
  forwardTicket(): void {

    const apiUrl = `https://localhost:7297/api/Ticket/forward-ticket/${this.selectedTicket.ticket_id}`;
    const updateRequest = { admin_category: this.selectedAdminCategory };

    this.http.put(apiUrl, updateRequest, { responseType: 'text' }).subscribe(
      (response) => {
        alert('Ticket forwarded successfully!');
        this.closePopup(); // Close popup after forwarding
        this.getNewTickets(); // Refresh tickets list
      },
      (error) => {
        console.error('Error forwarding ticket:', error);
        alert('Failed to forward the ticket.');
      }
    );
  }


  



  // Method to open the popup with ticket details
  openPopup(ticket: any) {
    this.selectedTicket = ticket;
    this.adminResponse = ''; // Reset admin response
  }

  // Method to close the popup
  closePopup() {
    this.selectedTicket = null;
  }

  // Button handlers
  onResolve() {
    if (this.selectedTicket) {
      this.updateTicket(this.selectedTicket.ticket_id, 'resolved', this.adminResponse);
    }
  }

  onProgress() {
    if (this.selectedTicket) {
      this.updateTicket(this.selectedTicket.ticket_id, 'in_progress', this.adminResponse);
    }
  }

  onForward() {
    this.forwardTicket()
  }

}

