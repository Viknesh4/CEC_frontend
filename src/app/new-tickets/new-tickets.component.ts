import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-new-tickets',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './new-tickets.component.html',
  styleUrl: './new-tickets.component.css'
})
export class NewTicketsComponent {
  rtickets: any[] = [];
  paginatedTickets: any[] = [];
  currentPage: number = 1;
  ticketsPerPage: number = 8;
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
  emailcontent = {to:'',subject:'Query Update Status',body:''};
  logoUrl: string = "https://i.postimg.cc/Y9KLVq7F/logo-png.png"
  noTicketsMessage: string ='';

constructor( private apiService: ApiService) {}

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
    const endpoint = `api/Ticket/Login/${this.admin_type}`; // Correct string interpolation
  
    // Using ApiService to fetch new tickets
    this.apiService.get<any[]>(endpoint).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.tickets = data; // Set the tickets data
          this.noTicketsMessage = ''; // Clear the no-tickets message
        } else {
          this.tickets = []; // Ensure the tickets array is empty
          this.noTicketsMessage = 'No tickets available'; // Set the no-tickets message
        }
      },
      error: (error) => {
        console.error('Error fetching new tickets', error);
        this.noTicketsMessage = 'An error occurred while fetching tickets. Please try again later.';
      }
    });
  }
  
  getdescription(order_id: number): any {
    const endpoint = `api/Order/Getod/${order_id}`; // Correct string interpolation

  // Using ApiService to fetch order description
  this.apiService.get<any[]>(endpoint).subscribe({
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
    const endpoint = 'api/User'; // Endpoint to fetch users
  
    // Using ApiService to fetch users data
    this.apiService.get<any[]>(endpoint).subscribe({
      next: (data) => {
        this.users = data; // Assign the fetched data to the users array
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }
  


  updateTicket(ticket_id: number, status?: string, message?: string) {
    // Endpoint for updating the ticket
    const endpoint = `api/Ticket/update-ticket/${ticket_id}`;
  
    // Create the update payload, only including non-null values
    const updateRequest: any = {};
    if (status) { updateRequest.status = status; }
    if (message) { updateRequest.message = message; }
    if (this.adminService.getAdminId()) updateRequest.assigned_admin_id = this.adminService.getAdminId();
  
    // Find the user by user_id from the ticket and set the email content 'to' field
    const user = this.users.find(u => u.user_id === this.selectedTicket.customer_id);
    if (user) {
      this.emailcontent.to = user.email; // Set the email address dynamically
    } else {
      console.error('User not found for the ticket.');
      this.emailcontent.to = 'sivavicky223@gmail.com'; // Default email if user not found
    }
  
    // Email template content
    this.emailcontent.body = `
      Dear Customer,
  
      Your query has been updated with the following 
  
      Status: "${status}"
      Message from Admin: ${message}
  
      ---
  
      For further assistance, contact us at 
      CEC@Support.com or call +91 9234567890.
      © 2024 CEC. All rights reserved.
    `;
  
    // Use ApiService to make the PUT request
    this.apiService.put(endpoint, updateRequest,  { responseType: 'text' }).subscribe({
      next: (response) => {
        this.popupMessage = 'Ticket updated successfully!';
        this.isSuccess = true;
        this.showPopup = true;
        this.getNewTickets(); // Refresh tickets
        this.sendEmail(this.emailcontent); // Send email after successful update
      },
      error: (error) => {
        console.error('Error updating ticket:', error);
        this.popupMessage = 'Failed to update the ticket';
        this.isSuccess = false;
        this.showPopup = true;
      }
    });
  }
  
  
  

  // Forward the ticket to a selected admin category
  forwardTicket(): void {
    // API endpoint for forwarding the ticket
    const endpoint = `api/Ticket/forward-ticket/${this.selectedTicket.ticket_id}`;
  
    // Prepare the update request
    const updateRequest = { admin_category: this.selectedAdminCategory };
  
    // Check if admin category is selected
    if (updateRequest.admin_category) {
      this.apiService.put(endpoint, updateRequest, { responseType: 'text' as 'json' }).subscribe({
        next: (response) => {
          this.popupMessage = 'Ticket Forwarded successfully!';
          this.getNewTickets(); // Refresh the tickets list
          this.isSuccess = true;
          this.showPopup = true; // Show the popup
        },
        error: (error) => {
          console.error('Error forwarding ticket:', error);
          this.popupMessage = `Failed to forward the ticket. Error: ${error.message || error.statusText}`;
          this.isSuccess = false;
          this.showPopup = true; // Show the popup
        },
      });
    } else {
      // If admin category is not selected
      this.popupMessage = 'Please choose an admin category before forwarding.';
      this.isSuccess = false;
      this.showPopup = true; // Show the popup
    }
  }
  



  sendEmail(email: { to: string; subject: string; body: string }): void {
    const endpoint = 'api/Email/send';  // API endpoint for sending email
  
  // Using ApiService to send the email
  this.apiService.post(endpoint, email).subscribe(
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
      const endpoint = `api/Ticket/getImageBase64?ticketId=${ticketId}`;
      this.apiService.get<{ base64Image: string }>(endpoint).subscribe({
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

