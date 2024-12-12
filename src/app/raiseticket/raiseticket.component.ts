import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raise-ticket',
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './raiseticket.component.html',
  styleUrls: ['./raiseticket.component.css']
})
export class RaiseticketComponent implements OnInit{
  http = inject(HttpClient)
  router = inject(Router);
  customerId: number = 0;
  orderId: number = 0;
  userService = inject(UserService);
  // FormGroup for ticket

  ticketForm = new FormGroup({
      category: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      priority: new FormControl(''),
      assigned_admin_id: new FormControl(0),
      ticket_id:new FormControl(0),
      admin_type:new FormControl(''),
    });


  // Categories and related issues
  categories = [
    {
      name: 'General',
      admintype: "G",
      issues: [
        { title: 'General Query', priority: 3 },
        { title: 'Feedback', priority: 4 },
        { title: 'Complaint', priority: 2 }
      ]
    },
    {
      name: 'Logistics',
      admintype: "L",
      issues: [
        { title: 'Delayed Delivery', priority: 1 },
        { title: 'Lost Package', priority: 1 },
        { title: 'Wrong Address', priority: 2 }
      ]
    },
    {
      name: 'Technical',
      admintype: "T",
      issues: [
        { title: 'Website Issue', priority: 2 },
        { title: 'Payment Failure', priority: 1 },
        { title: 'App Bug', priority: 3 }
      ]
    }
  ];

  issues: any[] = []; // Issues for the selected category

  // Handle category change
  onCategoryChange(event: Event) {
    const selectedCategory = (event.target as HTMLSelectElement).value;
    const categoryData = this.categories.find(cat => cat.name === selectedCategory);
    if (categoryData) {
      this.issues = categoryData.issues;
      this.ticketForm.get('admin_type')?.setValue(categoryData.admintype);
    }
  }

  // Set priority based on the selected issue
  setPriorityBasedOnIssue(event: Event) {
    const selectedIssue = (event.target as HTMLSelectElement).value;
    const issueData = this.issues.find(issue => issue.title === selectedIssue);
    if (issueData) {
      this.ticketForm.get('priority')?.setValue(issueData.priority);
    }
  }


  ngOnInit(): void {
    // Retrieve customer ID and order ID from the service
    const user = this.userService.getUser();
    this.customerId = user.cus_id;
    this.orderId = this.userService.getSelectedOrderId();
  }

  
  // Submit the ticket
  raiseTicket(): void {
    if (this.ticketForm.valid) {
      const ticketData = {
        customer_id: this.customerId,
        order_id: this.orderId,
        status:'new',
        ...this.ticketForm.value
      };
      console.log(ticketData)
  
      this.http.post('https://localhost:7297/api/Ticket', ticketData).subscribe({
        next: (response) => {
          console.log('Ticket raised successfully:', response);
          alert('Ticket raised successfully!');
          this.ticketForm.reset();
          this.router.navigate(['mytickets']);
          this.issues = []; // Clear the issues array
        },
        error: (error) => {
          console.error('Error raising ticket:', error);
          alert('An error occurred while raising the ticket. Please try again.');
        }
      });
    } else {
      alert('Please fill all required fields.'); // Handle invalid form submissions
    }
  }
}
