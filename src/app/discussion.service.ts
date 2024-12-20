import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Discussion {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

interface Reply {
  id: number;
  discussionId: number;
  content: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  private apiUrl = 'https://localhost:7297/api/Discussions';  // Adjust to match your backend API

  constructor(private http: HttpClient) { }

  // Get all discussions
  getDiscussions(): Observable<Discussion[]> {
    return this.http.get<Discussion[]>(this.apiUrl);
  }

  // Add a new discussion
  addDiscussion(discussion: Discussion): Observable<Discussion> {
    return this.http.post<Discussion>(this.apiUrl, discussion);
  }

  // Add a reply to a discussion
  addReply(discussionId: number, reply: Reply): Observable<Reply> {
    return this.http.post<Reply>(`${this.apiUrl}/${discussionId}/reply`, reply);
  }
}
