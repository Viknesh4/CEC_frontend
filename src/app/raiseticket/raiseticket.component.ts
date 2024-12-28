import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-raise-ticket',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './raiseticket.component.html',
  styleUrls: ['./raiseticket.component.css'],
})
export class RaiseticketComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  userService = inject(UserService);
  customerId = 0;
  orderId = 0;
  ticket_id = 0;
  selectedFile: File | null = null; // Store the single selected file
  showPopup: boolean = false; // Controls popup visibility
  isSuccess: boolean = false; // Determines success or failure
  popupMessage: string = ''; // The message to display

  // Method to trigger popup
  triggerPopup(isSuccess: boolean, message: string) {
    this.isSuccess = isSuccess;
    this.popupMessage = message;
    this.showPopup = true;

    // Auto-hide popup after 3 seconds
    setTimeout(() => {
      this.showPopup = false;
      if (isSuccess) {
        this.router.navigate(['mytickets']);
      }
    }, 2000);
  }

  // Ticket Form Initialization
  ticketForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl(''),
    assigned_admin_id: new FormControl(0),
    ticket_id: new FormControl(0),
    admin_type: new FormControl(''),
  });

  categories = [
    {
      name: 'General',
      admintype: 'G',
      issues: [
        { title: 'General Query', priority: 3 },
        { title: 'Feedback', priority: 4 },
        { title: 'Complaint', priority: 2 },
        { title: 'Others', priority: 3 },
      ],
    },
    {
      name: 'Logistics',
      admintype: 'L',
      issues: [
        { title: 'Delayed Delivery', priority: 1 },
        { title: 'Lost Package', priority: 1 },
        { title: 'Wrong Address', priority: 2 },
        { title: 'Others', priority: 3 },
      ],
    },
    {
      name: 'Technical',
      admintype: 'T',
      issues: [
        { title: 'Website Issue', priority: 2 },
        { title: 'Payment Failure', priority: 1 },
        { title: 'App Bug', priority: 3 },
        { title: 'Others', priority: 3 },
      ],
    },
  ];

  issues: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const user = this.userService.getUser();
    this.customerId = user.cus_id;
    this.orderId = this.userService.getSelectedOrderId();
  }

  // Handle file selection (single file)
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0]; // Store the single selected file
    }
  }

  // Handle Category Change
  onCategoryChange(event: Event) {
    const selectedCategory = (event.target as HTMLSelectElement).value;
    this.issues = []; // Reset issues dropdown
    this.ticketForm.get('title')?.setValue('');
    const categoryData = this.categories.find(cat => cat.name === selectedCategory);
    if (categoryData) {
      this.issues = categoryData.issues;
      this.ticketForm.get('admin_type')?.setValue(categoryData.admintype);
    }
  }

  // Set Priority Based on Issue
  setPriorityBasedOnIssue(event: Event) {
    const selectedIssue = (event.target as HTMLSelectElement).value;
    const issueData = this.issues.find(issue => issue.title === selectedIssue);
    if (issueData) {
      this.ticketForm.get('priority')?.setValue(issueData.priority);
    }
  }

  // Submit Ticket
  raiseTicket(): void {
    if (this.ticketForm.valid) {
      const ticketData = {
        customer_id: this.customerId,
        order_id: this.orderId,
        status: 'new',
        ...this.ticketForm.value,
      };

      const endpoint = 'api/Ticket';
    this.apiService.post<any>(endpoint, ticketData).subscribe({
        next: (data: any) => {
          this.ticket_id = data.ticket_id;
          if (this.selectedFile) {
            this.uploadTicketImage(this.ticket_id);
          } else {
            // If no image is selected, show a success message
            this.triggerPopup(true, 'Ticket raised successfully!');
            
          }

          this.ticketForm.reset();
          this.issues = [];
          this.selectedFile = null; // Clear the selected file
        },
        error: () => {
          this.triggerPopup(false, 'An error occurred while raising the ticket.');
        },
      });
    } else {
      this.triggerPopup(false, 'Please fill all required fields.');
    }
  }

  isModalOpen = false;

  openHelpModal() {
    this.isModalOpen = true;
  }

  closeHelpModal() {
    this.isModalOpen = false;
  }

  // Upload the single image
  uploadTicketImage(ticketId: number): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('ticketId', ticketId.toString());

      // Make the HTTP POST request to upload the image
      const endpoint = 'api/Ticket/uploadImage';
      this.apiService.post<any>(endpoint, formData).subscribe({
        next: () => {
          this.triggerPopup(true, 'Ticket raised and image uploaded successfully!');
        },
        error: () => {
          this.triggerPopup(false, 'An error occurred while uploading the image.');
        },
      });
    }
  }
}
