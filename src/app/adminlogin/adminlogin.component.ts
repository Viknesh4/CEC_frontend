

import { Component,inject} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports:[HttpClientModule,ReactiveFormsModule,CommonModule],
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent {
  userService = inject(UserService)
  http = inject(HttpClient)
  router = inject(Router);
  
    // Initialize the form group
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    adminType: new FormControl('G', Validators.required) // Default to "General"
  });


  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.http.post('https://localhost:7297/api/Admin/login', loginData)
        .subscribe({
          next: (response:any) =>{
            this.userService.setAdminType(response.admintype);
            this.userService.setAdminId(response.adminid);
            console.log('Login successful', response);
            alert('Login successful!');
            this.router.navigate(['adashboard']);
          },
          error: (err) => {
            console.error('Login failed', err);
            alert('Login failed. Please check your credentials.');
          }
    });
    }
  }
}
