import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Service/auth.service';
import { loginUser } from '../../../core/models/loginUser'; 
import { AuthResponse } from '../../../core/models/AuthResponse';
import { UserDetails } from '../../../core/models/user-details';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
  if (this.loginForm.valid) {
   
    const userData: loginUser = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    console.log('Sending to API:', userData);

    this.authService.loginUser(userData).subscribe({
      next: (response: AuthResponse) => {
        console.log('API Response:', response);
        if (response && response.accessToken) {
          console.log('Login successful, token received:', response.accessToken);
          this.authService.saveToken(response.accessToken);
          this.authService.getUserByEmail(this.loginForm.value.email).subscribe({
            next: (userDetails: UserDetails) => {
              const role = userDetails?.role || 'Citizen';
              this.authService.saveRole(role);
              this.navigateToDashboard(role);
            },
            error: () => {
              this.authService.saveRole('Citizen');
              this.navigateToDashboard('Citizen');
            }
          });
        }
      },
      error: (err: any) => {
       
        console.error('HTTP Error Details:', err);
        this.toast.error('Login failed: ' + (err.error?.message || 'Server unreachable'));
      }
    });
  }
}

  navigateToDashboard(role: string) {
    const normalizedRole = this.authService.normalizeRole(role);
    const roleRoutes: { [key: string]: string } = {
      CITIZEN: '/citizen-portal',
      ADMIN: '/admin',
      PLANNER: '/city-planner',
      COMPLIANCE: '/compliance-officer',
      AUDITOR: '/government-auditor'
    };

    const route = roleRoutes[normalizedRole] || '/citizen-portal';
    this.router.navigate([route]);
  }
}