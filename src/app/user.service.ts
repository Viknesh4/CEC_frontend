

// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  adminid: number= 0;
  private username: string = " ";
  private email: string = " ";
  private cus_id: number = 0;
  private selectedOrderId: number = 0;
  private admin_type: string = " ";
  setUser(username: string, email: string,cus_id: number): void {
    this.username = username;
    this.email = email;
    this.cus_id = cus_id; 
  }
  setAdminId(adminid: number) : void {
    this.adminid = adminid;
  }

  getAdminId(): number {
    return this.adminid;
  }

  getUser(): { username: string; email: string; cus_id: number} {
    return { username: this.username, email: this.email, cus_id:this.cus_id };
  }
  
  clearUser(): void {
    this.username = "";
    this.email = "";
    this.cus_id = 0;
    this.selectedOrderId = 0;
  }

  setSelectedOrderId(orderId: number): void {
    this.selectedOrderId = orderId;
  }

  getSelectedOrderId(): number {
    return this.selectedOrderId;
  }

  setAdminType(admin_type: string): void{
    this.admin_type = admin_type;
  }

  getAdmintype():string {
    return this.admin_type;
  }
}
