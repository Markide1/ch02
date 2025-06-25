import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})

// Component class for user login
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error = '';
  loading = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Lifecycle hook to initialize component and handle query parameters
  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: import('@angular/router').Params) => {
        if (params['registered'] === 'true') {
          this.successMessage =
            'Registration successful! Please log in with your credentials.';
          if (params['email']) {
            this.loginForm.patchValue({ email: params['email'] as string });
          }
        }
      },
    );
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    const email: string = (this.loginForm.get('email')?.value as string) ?? '';
    const password: string =
      (this.loginForm.get('password')?.value as string) ?? '';

    this.authService.login(email, password).subscribe({
      next: () => {
        void this.router.navigate(['/notes']);
      },
      error: (err: { error: { message: string } }) => {
        this.error = err.error.message || 'Login failed';
        this.loading = false;
      },
    });
  }
}
