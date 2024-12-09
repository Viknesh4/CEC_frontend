import { Component, ElementRef, ViewChild, AfterViewInit,Input,Output,EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports:[RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent  {

  imagePath="cecLogo.png"
  isSidebarActive = false;

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }
}
