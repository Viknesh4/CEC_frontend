import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-suggestion',
  standalone: true,
  
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.css',
  animations: [
    trigger('boxAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-50px)', opacity: 0 }),
        animate('0.5s 0.2s', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
  imports: [CommonModule,FormsModule] 
})
export class SuggestionComponent {
  isSuggestionVisible: boolean = false;
  selectedEmoji: string = '';
  selectedArea: string = '';

  // Function to handle emoji button click
  selectEmoji(emoji: string) {
    this.selectedEmoji = emoji;
    this.isSuggestionVisible = true;  // Show suggestion box
  }

  // Function to handle suggestion area selection
  selectArea(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.selectedArea = target.value;
    }
  }
  submitSuggestion() {
    // Collect form data
    const formData = new FormData();
    formData.append('emoji', 'User-selected emoji');
    formData.append('name', (document.getElementById('name') as HTMLInputElement).value);
    formData.append('email', (document.getElementById('email') as HTMLInputElement).value);
    formData.append('area', (document.getElementById('area') as HTMLSelectElement).value);
    formData.append('suggestion', (document.getElementById('suggestion') as HTMLTextAreaElement).value);
    
    

    // Send data to backend
    console.log('Form submitted with data:', formData);
    alert('Suggestion submitted successfully!');
  }
}
