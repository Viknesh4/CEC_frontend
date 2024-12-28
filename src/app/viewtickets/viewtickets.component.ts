import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-viewtickets',
  imports: [HttpClientModule,CommonModule],
  templateUrl: './viewtickets.component.html',
  styleUrl: './viewtickets.component.css'
})
export class ViewticketsComponent implements OnInit{
  rtickets: any[] = [];
  paginatedTickets: any[] = [];
  currentPage: number = 1;
  ticketsPerPage: number = 5;

  
  tickets:any[]=[];
  totalQueries: number = 0;
  cus_id:number = 0;
  name: string = '';
  message = "";
  userService = inject(UserService);
  ngOnInit(): void{
    const user = this.userService.getUser();
    this.cus_id = user.cus_id;
    this.name = user.username;
    this.fetchTicketsData();
  }
  http = inject(HttpClient)
constructor(private apiService: ApiService) {}


  fetchTicketsData(): void {
    const endpoint = `api/Ticket/${this.cus_id}`; // The endpoint path for fetching tickets
  this.apiService.get<any[]>(endpoint).subscribe({
      next: (data) => {
        this.tickets = data; 
        if(this.tickets.length == 0 || null){
          this.message = "No data Found";
        }
      },
      error:  (err) => {
        console.error('Error while fetching the user:', err);
        alert('There was an error during fetching. Please try again.');
      },
  });
  }
  updatePaginatedTickets(): void {
    const startIndex = (this.currentPage - 1) * this.ticketsPerPage;
    const endIndex = startIndex + this.ticketsPerPage;
    this.paginatedTickets = this.tickets.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedTickets();
  }

  get totalPages(): number {
    return Math.ceil(this.tickets.length / this.ticketsPerPage);
  }
}
