import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SuperadminService } from '../superadmin.service';

@Component({
  selector: 'app-superlogin',
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './superlogin.component.html',
  styleUrl: './superlogin.component.css'
})
export class SuperloginComponent {
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;
  credentials = {
    username: '',
    password: '',
  };
  errorMessage: string | null = null;
 


  constructor(private superAdminService:SuperadminService,private router:Router, private apiService: ApiService) {}

  onSubmit() {
    const endpoint = 'api/SuperAdmin/login'; // Define the endpoint

  this.apiService.post(endpoint, this.credentials).subscribe(
        (response: any) => {
          this.triggerPopup(true, 'Login successful!');
          this.superAdminService.setSuperAdminStatus(true);
        },
        (error) => {
          this.triggerPopup(false, 'Login failed. Please check your credentials.');
          this.errorMessage = error.error.message;
        }
      );
  }

  
triggerPopup(isSuccess: boolean, message: string): void {
  this.isSuccess = isSuccess;
  this.popupMessage = message;
  this.showPopup = true;

  // Auto-hide popup after 3 seconds
  setTimeout(() => {
    this.showPopup = false;
    if(isSuccess){
      this.router.navigate(['superadmin_']);
    }
  }, 1000);
}
}
