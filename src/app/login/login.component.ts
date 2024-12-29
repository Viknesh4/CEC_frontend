import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service'; 
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;
  http = inject(HttpClient);
  router = inject(Router);
  userService = inject(UserService);
  showPassword: boolean = false;

  // Initialize the login form
  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)])
  });

  
  constructor(private fb: FormBuilder, private apiService: ApiService) {
    // Initialize form with validation rules
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email field with required and valid email rules
      password: ['', [Validators.required, Validators.minLength(6)]], // Password field with required and minimum length of 6
    });
  }

  // Method to toggle the password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Method to handle login
  onSubmit(): void {
    if (this.loginForm.valid) {
      const emailControl = this.loginForm.get('email');
      if (emailControl && emailControl.value) {
        emailControl.setValue(emailControl.value.toLowerCase());
      }
  
      const loginData = this.loginForm.value;
      const endpoint = 'api/User/Login'; // Endpoint for login API
  
      // Using ApiService to post login data
      this.apiService.post(endpoint, loginData).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          this.userService.setUser(response.username, response.email, response.cus_id);
          // Trigger popup for successful login
          this.triggerPopup(true, 'Login successful!');
        },
        error: (err) => {
          console.error('Login error:', err);
          this.triggerPopup(false, 'Login failed. Please check your credentials.');
        }
      });
    } else {
      alert('Please fill all fields correctly.');
    }
  }
  

  // Navigate to the Sign-Up page
  navigateToSignUp() {
    this.router.navigate(['register']);
  }

  triggerPopup(isSuccess: boolean, message: string): void {
    this.isSuccess = isSuccess;
    this.popupMessage = message;
    this.showPopup = true;
  
    // Auto-hide popup after 3 seconds
    setTimeout(() => {
      this.showPopup = false;
      if(isSuccess){
        this.router.navigate(['userhome']);
      }
    }, 900);
  }
}
