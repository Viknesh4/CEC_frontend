import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-superlogin',
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './superlogin.component.html',
  styleUrl: './superlogin.component.css'
})
export class SuperloginComponent {
  credentials = {
    username: '',
    password: '',
  };
  errorMessage: string | null = null;
 


  constructor(private http: HttpClient,private router:Router, private apiService: ApiService) {}

  onSubmit() {
    const endpoint = 'api/SuperAdmin/login'; // Define the endpoint

  this.apiService.post(endpoint, this.credentials).subscribe(
        (response: any) => {

          alert(response.message);
          this.router.navigate(['superadmin_']);
        },
        (error) => {
          this.errorMessage = error.error.message;
        }
      );
  }
}
