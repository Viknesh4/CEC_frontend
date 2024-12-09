import { Component,inject } from '@angular/core';
import { FormControl, Validators,FormGroup,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  // Method to submit the form and create the admin
  createAdmin() {
    if (this.adminForm.valid) {
      this.http.post('https://localhost:7297/api/Admin', this.adminForm.value)
        .subscribe({
          next: (response) => {
            console.log('Admin created successfully:', response);
            alert('Admin has been created successfully!');
            this.adminForm.reset();
          },
          error: (err) => {
            console.error('Error during admin creation:', err);
            alert('There was an error while creating the admin. Please try again.');
          }
        });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
