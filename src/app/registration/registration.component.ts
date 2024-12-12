import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule} from '@angular/common'; 
import { Router } from '@angular/router';
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [HttpClientModule, FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  http = inject(HttpClient);
  router = inject(Router);
  private passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };
  // Initialize the form group for registration with the custom validator
  registrationForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone_number: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl<string>('', [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  // Method to submit the registration data to the backend
  registerUser() {
    if (this.registrationForm.valid) {
      this.http.post('https://localhost:7297/api/User', this.registrationForm.value)
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            alert('You have been registered successfully!');
            this.router.navigate(['login']);
            this.registrationForm.reset(); // Reset the form after submission
          },
          error: (err) => {
            console.error('Error during registration:', err);
            alert('There was an error during registration. Please try again.');
          }
        });
    } else {
      alert('Please fill all fields correctly.');
    }
  }

  // Custom validator function to check if passwords match
  
}
