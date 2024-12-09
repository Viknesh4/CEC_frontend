import { Component, } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { filter } from 'rxjs';
import { CreateadminComponent } from "./createadmin/createadmin.component";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent, CreateadminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CEC';
  showNavbar: boolean = true;

  constructor(private router: Router) {
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Access the current route and its 'data' to decide if navbar should be shown
      const route = this.router.routerState.snapshot.root;
      this.showNavbar = route.firstChild?.data?.['showNavbar'] ?? true;
    });
  }
}
