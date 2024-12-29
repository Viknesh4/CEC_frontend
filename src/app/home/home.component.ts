import { HttpClientModule } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [RouterLink, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  dropdownVisible: boolean = false;

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown') as HTMLElement | null;
    const loginButton = document.querySelector('a[data-toggle="dropdown"]') as HTMLElement | null;

    if (
      dropdown &&
      loginButton &&
      !loginButton.contains(target) &&
      !dropdown.contains(target)
    ) {
      this.dropdownVisible = false;
    }
  }

}
