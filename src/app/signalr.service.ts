import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;

  constructor() { }

  // Start the SignalR connection
  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7297/forumHub') // Ensure this matches your backend SignalR Hub URL
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('Error while starting connection: ', err));
  }

  // Listen for messages from the hub
  public listenForMessages() {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
        console.log(`${user}: ${message}`);
      });
    }
  }

  // Listen for new replies in real time
  public listenForReplies() {
    if (this.hubConnection) {
      this.hubConnection.on('ReplyAdded', (discussionId: number) => {
        console.log(`New reply added to discussion with ID: ${discussionId}`);
        // You can handle this to update the frontend UI (e.g., notify the user, refresh the discussion)
      });
    }
  }

  // Send a message to the hub
  public sendMessage(user: string, message: string) {
    if (this.hubConnection) {
      this.hubConnection.invoke('SendMessage', user, message)
        .catch(err => console.error('Error while sending message: ', err));
    }
  }

  // Notify all clients when a new reply is added
  public notifyNewReply(discussionId: number) {
    if (this.hubConnection) {
      this.hubConnection.invoke('NewReplyNotification', discussionId)
        .catch(err => console.error('Error while notifying new reply: ', err));
    }
  }
}
