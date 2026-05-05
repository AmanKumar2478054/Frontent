import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Service/auth.service';
import { loginUser } from '../../../core/models/loginUser'; 
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
    private authService: AuthService
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
      next: (response) => {
        console.log('API Response:', response);
        if (response && response.accessToken) {
          console.log('Login successful, token received:', response.accessToken);
          this.authService.saveToken(response.accessToken);
          this.authService.getUserByEmail(this.loginForm.value.email).subscribe({
            next: (userDetails) => {
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
      error: (err) => {
       
        console.error('HTTP Error Details:', err);
        alert('Login failed: ' + (err.error?.message || 'Server unreachable'));
      }
    });
  }
}

  navigateToDashboard(role: string) {
    const roleRoutes: { [key: string]: string } = {
      'Citizen': '/citizen-portal',
      'Administrator': '/admin',
      'City Planner': '/city-planner',
      'Compliance Officer': '/compliance-officer',
      'Government Auditor': '/government-auditor'
    };

    const route = roleRoutes[role] || '/citizen-portal';
    this.router.navigate([route]);
  }
}