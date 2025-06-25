import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './welcome.component.html',
  providers: [AuthService],
})

// A welcome component that displays a welcome content and a links to the notes, login and registration sections.
export class WelcomeComponent {
  constructor(public authService: AuthService) {}
}
