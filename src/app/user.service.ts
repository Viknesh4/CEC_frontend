import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_KEY = 'user';
  private readonly SELECTED_ORDER_ID_KEY = 'selectedOrderId';

  // Set user details in session storage
  setUser(username: string, email: string, cus_id: number): void {
    const user = { username, email, cus_id };
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Get user details from session storage
  getUser(): { username: string; email: string; cus_id: number } {
    const user = sessionStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : { username: '', email: '', cus_id: 0 };
  }

  // Clear user details from session storage
  clearUser(): void {
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.SELECTED_ORDER_ID_KEY);
  }

  // Set selected order ID in session storage
  setSelectedOrderId(orderId: number): void {
    sessionStorage.setItem(this.SELECTED_ORDER_ID_KEY, orderId.toString());
  }

  // Get selected order ID from session storage
  getSelectedOrderId(): number {
    const orderId = sessionStorage.getItem(this.SELECTED_ORDER_ID_KEY);
    return orderId ? parseInt(orderId, 10) : 0;
  }
}
