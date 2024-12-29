import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { SuperadminService } from './superadmin.service';


export const homeGuard: CanActivateFn = (route, state) => {
  const superAdminService = inject(SuperadminService);
  const router = inject(Router);

  if (superAdminService.getSuperAdminStatus()) {
    return true; // Allow access if the user is authenticated
  } else {
    router.navigate(['/superlogin']); // Redirect to login if not authenticated
    return false;
  }
};
