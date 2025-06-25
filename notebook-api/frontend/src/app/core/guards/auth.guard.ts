import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        return true;
      }
    }

    void this.router.navigate(['/auth/login']);
    return false;
  }
}
