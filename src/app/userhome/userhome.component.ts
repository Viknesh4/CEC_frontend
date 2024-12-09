import { Component, OnChanges, Input, AfterViewInit, SimpleChanges, ViewChild, ElementRef, inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content',
  imports: [RouterModule, HttpClientModule, CommonModule],
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css'],
})
export class UserhomeComponent implements OnInit {
  // Input to receive sidebar state
  username: string = '';
  email: string = '';
  cus_id: number = 0;
  http = inject(HttpClient);
  router = inject(Router);
  userService = inject(UserService);

  orders: any[] = []; 

  
  ngOnInit() {
    // Get user data from the UserService
    const user = this.userService.getUser();
    if (user && user.username && user.email && user.cus_id) {
      this.username = user.username;
      this.email = user.email;
      this.cus_id = user.cus_id;
      
      // Fetch orders using the email
      this.http.get<any[]>(`https://localhost:7297/api/Order/${this.email}`)
        .subscribe({
          next: (response) => {
            this.orders = response;
          },
          error: (error) => {
            console.error('Error fetching order details:', error);
          }
        });
    } else {
      console.error('User data is not available.');
    }
  }
  raiseTicket(orderId: number): void {
    console.log('Navigating to ticket page with Order ID:', orderId);
    this.userService.setSelectedOrderId(orderId);
    this.router.navigate(['ticket']);
  }
}
