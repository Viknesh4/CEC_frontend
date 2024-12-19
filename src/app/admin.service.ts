import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly ADMIN_ID_KEY = 'adminid';
  private readonly ADMIN_TYPE_KEY = 'admin_type';

  // Set admin ID in session storage
  setAdminId(adminid: number): void {
    sessionStorage.setItem(this.ADMIN_ID_KEY, adminid.toString());
  }

  // Get admin ID from session storage
  getAdminId(): number {
    const adminid = sessionStorage.getItem(this.ADMIN_ID_KEY);
    return adminid ? parseInt(adminid, 10) : 0;
  }

  // Remove admin ID from session storage
  clearAdminId(): void {
    sessionStorage.removeItem(this.ADMIN_ID_KEY);
  }

  // Set admin type in session storage
  setAdminType(admin_type: string): void {
    sessionStorage.setItem(this.ADMIN_TYPE_KEY, admin_type);
  }

  // Get admin type from session storage
  getAdminType(): string {
    const admin_type = sessionStorage.getItem(this.ADMIN_TYPE_KEY);
    return admin_type || '';
  }

  // Remove admin type from session storage
  clearAdminType(): void {
    sessionStorage.removeItem(this.ADMIN_TYPE_KEY);
  }

  // Clear all admin-related session storage data
  clearAdminData(): void {
    sessionStorage.removeItem(this.ADMIN_ID_KEY);
    sessionStorage.removeItem(this.ADMIN_TYPE_KEY);
  }
}
