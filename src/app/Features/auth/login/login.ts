import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Service/auth.service';
import { User } from '../../../core/models/user'; 
import { loginUser } from '../../../core/models/loginUser'; 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  selectedRole: string = 'Citizen';
  roles = ['Citizen', 'City Planner', 'Administrator', 'Compliance Officer', 'Government Auditor'];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute, 
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['Citizen', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const role = params['role'];
      if (role && this.roles.includes(role)) {
        this.selectedRole = role;
        this.loginForm.patchValue({ role: role });
      }
    });
  }

  onRoleChange(newRole: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { role: newRole },
      queryParamsHandling: 'merge'
    });
    this.loginForm.patchValue({ role: newRole });
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
          localStorage.setItem('role', this.loginForm.value.role);
          this.navigateToDashboard(this.loginForm.value.role);
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