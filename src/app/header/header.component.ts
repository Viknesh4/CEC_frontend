import { Component, ElementRef, ViewChild, AfterViewInit,Input,Output,EventEmitter, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  imports:[RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent  {
  userService = inject(UserService)
  router = inject(Router)
  imagePath="cecLogo.png"
  isSidebarActive = false;

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  logout(): void {
    this.userService.clearUser(); // Clear session storage
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
