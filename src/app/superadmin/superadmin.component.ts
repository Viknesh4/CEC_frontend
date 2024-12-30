import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SuperadminService } from '../superadmin.service';

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [HttpClientModule, CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})
export class superadminComponent {
  showPopup: boolean = false;
  popupMessage: string = '';
  isSuccess: boolean = false;
  router = inject(Router);
  showNav: boolean = false;
  showAdminTable: boolean = false;
  showUserTable: boolean = false;
  showAdminAdd: boolean = false;
  showUserAdd: boolean = false;
  showQueryTable: boolean = false;
  showSuggestionTable: boolean = false;
  superadminService = inject(SuperadminService);
  toggleNav() {
    this.showNav = !this.showNav;
  }

  onLogout() {
    this.router.navigate(['/superlogin']);
  }
//Constructor
  constructor(private apiService: ApiService) {
    this.fetchAdminData();
    this.fetchUsersData();
    this.fetchTicketsData();
    this.fetchSuggestionData();
  }
  
  http = inject(HttpClient);
  admins: any[] = [];
  users: any[] = [];
  tickets : any[] = [];
  totalAdmins : number = 0;
  totalUsers : number = 0;
  totalQueries : number = 0;
  Suggestions: any[] = [];
  totalSuggestions: number = 0;



  // Fetch admin data from the API
  fetchAdminData(): void {
    const endpoint = 'api/Admin'; // Define the endpoint variable
  
  // Use ApiService to fetch admin data
  this.apiService.get<any[]>(endpoint).subscribe({
      next: (data) => {  
        this.admins = data; // Store the fetched data directly
        this.totalAdmins = data.length;
      },
      error: (error) => {
        console.error('Error fetching admin data:', error);
      },
    });
  }
  fetchUsersData(): void {
    const endpoint = 'api/User'; // Define the full endpoint for users
  
    this.apiService.get<any[]>(endpoint).subscribe({
      next: (data) => {
        this.users = data;
        this.totalUsers = data.length;
      }
  });
  }
  fetchTicketsData(): void {
    const endpoint = 'api/Ticket/GetAlltickets'; // Define the full endpoint for tickets

    this.apiService.get<any[]>(endpoint).subscribe({
      next: (data) => {
        this.tickets = data;
        this.totalQueries = data.length;
      }
  });
  }

  fetchSuggestionData(): void {
    const endpoint = 'api/Suggestion'; // Define the endpoint for fetching suggestions

    this.apiService.get<any[]>(endpoint).subscribe({
      next: (data) => {
        this.Suggestions = data;
        this.totalSuggestions = data.length;
      }
  });
  }
  // Call fetchAdminData when the component is initialized

  deleteAdmin(adminid: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      const endpoint = `api/Admin/${adminid}`; // Set endpoint for deleting the admin

      this.apiService.delete(endpoint).subscribe({
        next: () => {
          this.triggerPopup(true,'Admin deleted successfully');
          this.fetchAdminData(); // Refresh data
        },
        error: (err) => {
          console.error('Error deleting Admin:', err);
         this.triggerPopup(false,'Error deleting Admin');
        },
      });
    }

  }

  toggleAdminTable(): void {;
    this.showAdminTable = true;
    this.showUserTable = false;
    this.showAdminAdd = false;
    this.showUserAdd = false;
    this.showQueryTable = false;
    this.showSuggestionTable = false;
  }

  toggleSuggestionTable(): void {
    this.showAdminTable = false;
    this.showUserTable = false;
    this.showAdminAdd = false;
    this.showUserAdd = false;
    this.showQueryTable = false;
    this.showSuggestionTable = true;
  }

  toggleUserTable(): void {
    this.showAdminTable = false;
    this.showUserTable = true;
    this.showAdminAdd = false;
    this.showUserAdd = false;
    this.showQueryTable = false;
    this.showSuggestionTable = false;
  }

  toggleUserForm(): void {
    this.showAdminTable = false;
    this.showUserTable = false;
    this.showAdminAdd = false;
    this.showUserAdd = true;
    this.showQueryTable = false;
    this.showSuggestionTable = false;
  }

  toggleAdminForm(): void {
    this.showAdminTable = false;
    this.showUserTable = false;
    this.showAdminAdd = true;
    this.showUserAdd = false;
    this.showQueryTable = false;
    this.showSuggestionTable = false;
  }

  toggleTicketForm(): void {
    this.showAdminTable = false;
    this.showUserTable = false;
    this.showAdminAdd = false;
    this.showUserAdd = false;
    this.showQueryTable = true;
    this.showSuggestionTable = false;
  }

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  adminForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    admin_type: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl<string>('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  addNewAdmin() {
    if (this.adminForm.valid) {
      const endpoint = 'api/Admin'; // Set endpoint for adding a new admin
    
    this.apiService.post(endpoint, this.adminForm.value).subscribe({
          next: (response) => {
            console.log('Admin created successfully:', response);
            this.triggerPopup(true,'Admin has been created successfully!');
            this.fetchAdminData();
            this.adminForm.reset();
          },
          error: (err) => {
            console.error('Error during admin creation:', err);
            this.triggerPopup(false,'There was an error while creating the admin. Please try again.');
          }
        });
    } else {
      this.triggerPopup(false,'Please fill out the form correctly.');
    }
  }

  userForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone_number: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl<string>('', [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  addNewUser() {
    if (this.userForm.valid) {
      const endpoint = 'api/User'; // Set endpoint for adding a new user
    
      this.apiService.post(endpoint, this.userForm.value).subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.triggerPopup(true,'You have been registered successfully!');
            this.fetchUsersData();
            this.userForm.reset(); // Reset the form after submission
          },
          error: (err) => {
            console.error('Error during registration:', err);
            this.triggerPopup(false,'There was an error during registration. Please try again.');
          }
        });
    } else {
      this.triggerPopup(false,'Please fill all fields correctly.');
    }
  }



  //Edit Function

  editIndex: number | null = null;
  startEdit(index: number) {
    this.editIndex = index;
  }

  saveEdit(index: number) {
    const updatedUser = this.users[index];
    const endpoint = `api/User/${updatedUser.user_id}`; // Set endpoint for updating user
  
  this.apiService.put(endpoint, updatedUser).subscribe({
      next: () => {
        this.triggerPopup(true,'User updated successfully');
        this.editIndex = null; // Exit edit mode
        this.fetchUsersData(); // Refresh data
      },
      error: () => {
        this.triggerPopup(false,'Error updating user');
      },
    });
  }

  cancelEdit() {
    this.editIndex = null;
    this.fetchUsersData(); // Revert changes by re-fetching data
  }

  //delete User
  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      const endpoint = `api/User/${userId}`; // Set endpoint for deleting user
    
    this.apiService.delete(endpoint).subscribe({
        next: () => {
          this.triggerPopup(true,'User deleted successfully');
          this.fetchUsersData(); // Refresh data
        },
        error: (err) => {
          this.triggerPopup(false,'Error deleting user');
          console.error('Error deleting user:', err);
          
        },
      });
    }
  }

  //Edit on admin table
  editIndexU: number | null = null;

// Start editing a specific row
startEditU(index: number): void {
  this.editIndexU = index;
}

// Save edits for the specific row
saveEditU(index: number): void {
  const updatedAdmin = this.admins[index];
  const endpoint = `api/Admin/${updatedAdmin.admin_id}`; // Set endpoint for updating admin

  this.apiService.put(endpoint, updatedAdmin).subscribe({
    next: () => {
      this.triggerPopup(true,'Admin updated successfully');
      this.editIndexU = null; // Exit edit mode
      this.fetchAdminData(); // Refresh admin data
    },
    error: () => {
      this.triggerPopup(false,'Error updating admin');
    },
  });
}

// Cancel editing (revert changes)
cancelEditU(): void {
  this.editIndexU = null;
  this.fetchAdminData(); // Re-fetch data to discard unsaved changes
}

logout(){
  this.superadminService.setSuperAdminStatus(false);
  this.router.navigate(['/superlogin']);
}


triggerPopup(isSuccess: boolean, message: string): void {
  this.isSuccess = isSuccess;
  this.popupMessage = message;
  this.showPopup = true;

  // Auto-hide popup after 3 seconds
  setTimeout(() => {
    this.showPopup = false;
    if(isSuccess){
    }
  }, 2000);
}

}
