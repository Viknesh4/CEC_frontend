import { Component,inject } from '@angular/core';
import { FormControl, Validators,FormGroup,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-createadmin',
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule,CommonModule],
  templateUrl: './createadmin.component.html',
  styleUrl: './createadmin.component.css'
})
export class CreateadminComponent {

  http = inject(HttpClient);

  // Form for admin creation
  adminForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    admin_type: new FormControl(''),
  });
  constructor(private apiService: ApiService) {}


  // Method to submit the form and create the admin
  createAdmin(): void {
    if (this.adminForm.valid) {
      // Use ApiService to post data to the endpoint
      const endpoint = 'api/Admin';
      this.apiService.post(endpoint, this.adminForm.value).subscribe({
        next: (response) => {
          console.log('Admin created successfully:', response);
          alert('Admin has been created successfully!');
          this.adminForm.reset(); // Reset the form after successful creation
        },
        error: (err) => {
          console.error('Error during admin creation:', err);
          alert('There was an error while creating the admin. Please try again.');
        },
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
  
}
