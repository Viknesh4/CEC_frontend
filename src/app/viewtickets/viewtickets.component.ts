import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viewtickets',
  imports: [HttpClientModule,CommonModule],
  templateUrl: './viewtickets.component.html',
  styleUrl: './viewtickets.component.css'
})
export class ViewticketsComponent implements OnInit{
  private apiUrlT = 'https://localhost:7297/api/Ticket';
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

  fetchTicketsData(): void {
    this.http.get<any[]>(`${this.apiUrlT}/${this.cus_id}`).subscribe({
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
}
