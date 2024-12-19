import { Component, ElementRef, ViewChild, AfterViewInit,Input,Output,EventEmitter, inject, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports:[RouterLink,HttpClientModule,CommonModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent  {
  userService = inject(UserService)
  imagePath="cecLogo.png"
  isSidebarActive = false;

  constructor(private http: HttpClient, private router: Router) {}
  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  logout(): void {
    this.userService.clearUser(); // Clear session storage
    this.router.navigate(['/']); // Redirect to the login page
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    if (window.innerWidth > 768) {
      this.isSidebarActive = false; // Close sidebar on large screens
    }
  }
      ngOnInit(): void {

    }
  
}
