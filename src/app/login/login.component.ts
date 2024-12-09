import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  http = inject(HttpClient);
  router = inject(Router);
  userService = inject(UserService);

  // Initialize the login form
  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)])
  });

  // Method to handle login
  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post('https://localhost:7297/api/User/Login', this.loginForm.value)
        .subscribe({
          next: (response:any) => {
            console.log('Login successful:', response);
            alert('Login successful!');
            this.userService.setUser(response.username, response.email,response.cus_id);
            // Navigate to a different page after login
            this.router.navigate(['userhome']);
          },
          error: (err) => {
            console.error('Login error:', err);
            alert('Invalid credentials. Please try again.');
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
}
