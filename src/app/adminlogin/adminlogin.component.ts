

import { Component,inject} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  imports:[HttpClientModule,ReactiveFormsModule,CommonModule],
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent {
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;
  adminService = inject(AdminService)
  http = inject(HttpClient)
  router = inject(Router);
  showPassword: boolean = false;
    // Initialize the form group
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    adminType: new FormControl('G', Validators.required) // Default to "General"
  });

  constructor(private apiService: ApiService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      // Convert email to lowercase
      const emailControl = this.loginForm.get('email');
      if (emailControl && emailControl.value) {
        emailControl.setValue(emailControl.value.toLowerCase());
      }
  
      // Prepare login data
      const loginData = this.loginForm.value;
  
      // Call API through ApiService
      const endpoint = `api/Admin/login`;
      this.apiService.post(endpoint, loginData).subscribe({
        next: (response: any) => {
          // Set admin type and ID using AdminService
          this.adminService.setAdminType(response.admintype);
          this.adminService.setAdminId(response.adminid);
  
          // Log success and trigger success popup
          console.log('Login successful', response);
          this.triggerPopup(true, 'Login successful!');
        },
        error: (err) => {
          // Handle login error and trigger failure popup
          console.error('Login failed', err);
          this.triggerPopup(false, 'Login failed. Please check your credentials.');
        },
      });
    }
  }
  


triggerPopup(isSuccess: boolean, message: string): void {
  this.isSuccess = isSuccess;
  this.popupMessage = message;
  this.showPopup = true;

  // Auto-hide popup after 3 seconds
  setTimeout(() => {
    this.showPopup = false;
    if(isSuccess){
      this.router.navigate(['adashboard']);
    }
  }, 1000);
}
}
