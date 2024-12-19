import { afterNextRender, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
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
  users: any[] = [];
  orderd: any[] = [];
  adminCategories: string[] = ['G', 'L', 'T'];
  showMore: boolean = false; // Toggle for "See More"
  showPhoto: boolean = false; 
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;
  router = inject(Router);
  adminService = inject(AdminService);
  http = inject(HttpClient);
  emailcontent = {to:'sivavicky223@gmail.com',subject:'',body:''};
  apiURL: string = "https://localhost:7297/api/Ticket/Login";
  apiUrlE: string  = "https://localhost:7297/api/Email/send";
  apiUrlU: string  = "https://localhost:7297/api/User";
  noTicketsMessage: string ='';
  ngOnInit(): void {
    this.admin_type = this.adminService.getAdminType();
    this.getNewTickets();
    this.adminType = (this.admin_type === "T") ? "Technical" :
            (this.admin_type === "G") ? "General" :
            (this.admin_type === "L") ? "Logistics" : "";
    this.fetchUsersData();
    
  }
  getUserNameById(userId: number): string {
    const user = this.users.find((u) => u.user_id === userId);
    return user ? user.name : 'Unknown'; // Return "Unknown" if user is not found
  }
  toggleSeeMore() {
    this.showMore = !this.showMore;
  }
  
  // Method to show/hide photo
  viewPhoto(ticketid : number) {
    this.fetchImage(ticketid);
    this.showPhoto = true;
  }

  closePhotoPopup(): void {
    this.showPhoto = false; // Hide the photo modal
    this.imageUrl = '';// Clear the image URL

  }
  // Fetch new tickets from the API
  getNewTickets(): void {
    this.http.get<any[]>(`${this.apiURL}/${this.admin_type}`).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.tickets = data; // Set the tickets data
          this.noTicketsMessage = ''; // Clear the no-tickets message
        } else {
          this.tickets = []; // Ensure the tickets array is empty
          this.noTicketsMessage = 'No tickets available'; // Set the no-tickets message
        }
      },
      (error) => {
        console.error('Error fetching new tickets', error);
        this.noTicketsMessage = 'An error occurred while fetching tickets. Please try again later.';
      }
    );
  }
  getdescription(order_id: number): any {
    this.http.get<any[]>(`https://localhost:7297/api/Order/Getod/${order_id}`).subscribe({
      next : (data) => {
        this.orderd = data;
      },
      error: (error) => {
        console.error('Error fetching admin data:', error);
      }
    })
    return this.orderd ? this.orderd : 'Unknown'; // Return "Unknown" if user is not found
  }
 

  fetchUsersData(): void {
    this.http.get<any[]>(this.apiUrlU).subscribe({
      next: (data) => {
        this.users = data;
      }
  });
  }


  updateTicket(ticket_id: number, status?: string, message?: string) {
    // API endpoint for updating the ticket
    const apiUrl = `https://localhost:7297/api/Ticket/update-ticket/${ticket_id}`;
    
    // Create the update payload, only including non-null values
    const updateRequest: any = {};
    if (status) { updateRequest.status = status; this.emailcontent.subject = status; }
    if (message) { updateRequest.message = message; this.emailcontent.body = message; }
    if (this.adminService.getAdminId()) updateRequest.assigned_admin_id = this.adminService.getAdminId();
    // Find the user by user_id from the ticket and set the email content 'to' field
    const user = this.users.find(u => u.user_id === this.selectedTicket.customer_id);
    if (user) {
      this.emailcontent.to = user.email; // Set the email address dynamically
    } else {
      console.error('User not found for the ticket.');
      this.emailcontent.to = 'sivavicky223@gmail.com'; // Default email if user not found
    }
  
    // HTTP PUT request to update the ticket
    this.http.put(apiUrl, updateRequest, { responseType: 'text' }).subscribe(
      (response) => {
        this.popupMessage = 'Ticket updated successfully!';
        this.isSuccess = true;
        this.showPopup = true;
        this.getNewTickets();
        this.sendEmail(this.emailcontent); // Send email after successful update
      },
      (error) => {
        console.error('Error updating ticket:', error);
        this.popupMessage = `Failed to update the ticket`;
        this.isSuccess = false;
        this.showPopup = true;
      }
    );
  }
  
  

  // Forward the ticket to a selected admin category
  forwardTicket(): void {

    const apiUrl = `https://localhost:7297/api/Ticket/forward-ticket/${this.selectedTicket.ticket_id}`;
    const updateRequest = { admin_category: this.selectedAdminCategory };
    if(updateRequest.admin_category){
    this.http.put<any[]>(apiUrl, updateRequest, { responseType: 'text' as 'json' }).subscribe({
      next: (response) => {
        this.popupMessage = 'Ticket Forwarded successfully!';
        this.getNewTickets(); // Refresh tickets list
        this.isSuccess = true;
        this.showPopup = true; // Show the popup
      },
      error: (error) => {
        console.error('Error forwarding ticket:', error);
        this.popupMessage = `Failed to Forward the ticket. Error: ${error.message || error.statusText}`;
        this.isSuccess = false;
        this.showPopup = true; // Show the popup
      },
    });
  }
    else{
      this.popupMessage = `Choose a admin category before forwarding.`;
        this.isSuccess = false;
        this.showPopup = true;
    }
  }



  sendEmail(email: { to: string; subject: string; body: string }): void {
    this.http.post(this.apiUrlE, email).subscribe(
      (response) => {
        console.log('Email sent successfully:', response);
      },
      (error) => {
        console.error('Error sending email:', error);
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
    this.showMore = false; 
    this.showPopup = false;
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

  imageUrl: string | undefined; // To hold the URL for the image
  fetchImage(ticketId: number): void {
    if (ticketId > 0) {
      this.http
        .get<{ base64Image: string }>(`https://localhost:7297/api/Ticket/getImageBase64?ticketId=${ticketId}`)
        .subscribe({
          next: (response) => {
            this.imageUrl = `data:image/jpeg;base64,${response.base64Image}`; // Format Base64 string for img src
            console.log('Image fetched successfully:', this.imageUrl);
          },
          error: (err) => {
            console.error('Error fetching Base64 image:', err);
          },
        });
    } else {
      console.error('Invalid ticketId:', ticketId);
    }
  }

}

