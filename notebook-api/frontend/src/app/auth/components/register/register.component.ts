import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})

// Component class for user registration
export class RegisterComponent {
  registerForm;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Lifecycle hook to initialize component and handle query parameters
  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService
      .register(
        this.registerForm.value as {
          name: string;
          email: string;
          password: string;
        },
      )
      .subscribe({
        next: () => {
          this.loading = false;
          void this.router.navigate(['/auth/login'], {
            queryParams: {
              registered: 'true',
              email: String(this.registerForm.get('email')?.value ?? ''),
            },
          });
        },
        error: (err: { error?: { message?: string } }) => {
          this.error = err.error?.message || 'Registration failed';
          this.loading = false;
        },
      });
  }
}
