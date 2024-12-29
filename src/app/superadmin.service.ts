import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {
  private isSuperAdmin: boolean = false;

  // Set login status
  setSuperAdminStatus(status: boolean): void {
    this.isSuperAdmin = status;
  }

  // Get login status
  getSuperAdminStatus(): boolean {
    return this.isSuperAdmin;
  }

  
}
